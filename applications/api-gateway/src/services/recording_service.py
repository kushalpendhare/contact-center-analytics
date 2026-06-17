# src/services/recording_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from src.models.recording import Recording, RecordingStatus
from src.models.transcript import RecordingTranscript
from src.models.analysis import RecordingAnalysis
from src.models.user import User
from src.models.project import Project
from src.core.storage import storage_service
from src.services.bedrock_service import bedrock_service


def upload_recording(
    db: Session,
    project_id: int,
    current_user: User,
    filename: str,
    file_data: bytes,
    duration_seconds: float = None
) -> Recording:
    """Upload a recording file and create a Recording record."""
    
    # Verify project access
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    # Save file to storage
    file_path = storage_service.save_file(
        current_user.tenant_id,
        project_id,
        filename,
        file_data
    )
    
    # Create recording record
    recording = Recording(
        project_id=project_id,
        tenant_id=current_user.tenant_id,
        name=filename,
        file_path=file_path,
        uploaded_by=current_user.id,
        duration_seconds=duration_seconds,
        status=RecordingStatus.UPLOADED
    )
    
    db.add(recording)
    db.commit()
    db.refresh(recording)
    
    return recording


def get_recordings(db: Session, project_id: int, current_user: User) -> list[Recording]:
    """Get all recordings for a project."""
    return db.query(Recording).filter(
        Recording.project_id == project_id,
        Recording.tenant_id == current_user.tenant_id
    ).order_by(Recording.created_at.desc()).all()


def get_recording(db: Session, recording_id: int, current_user: User) -> Recording:
    """Get a specific recording."""
    recording = db.query(Recording).filter(
        Recording.id == recording_id,
        Recording.tenant_id == current_user.tenant_id
    ).first()
    
    if not recording:
        raise ValueError("Recording not found or access denied")
    
    return recording


def analyze_recording(db: Session, recording_id: int, current_user: User) -> RecordingAnalysis:
    """
    Analyze a recording:
    1. Get or create mock transcript
    2. Call Bedrock service for analysis
    3. Save analysis results
    """
    
    recording = get_recording(db, recording_id, current_user)
    
    # Check if analysis already exists
    existing_analysis = db.query(RecordingAnalysis).filter(
        RecordingAnalysis.recording_id == recording_id
    ).first()
    
    if existing_analysis:
        return existing_analysis
    
    # Get or create mock transcript
    transcripts = db.query(RecordingTranscript).filter(
        RecordingTranscript.recording_id == recording_id
    ).all()
    
    if not transcripts:
        # Create a mock transcript for testing
        mock_transcript_text = f"""
        Customer: Hi, I need help with my account.
        Agent: Sure, I'd be happy to help. Can you provide your account number?
        Customer: It's 12345678.
        Agent: Thank you. I'm looking that up now. I see you're calling about a billing issue?
        Customer: Yes, I was charged twice for my last order.
        Agent: I apologize for that. Let me investigate. I can see the duplicate charge here. 
        Agent: I've issued a refund for the duplicate charge. You should see it in 3-5 business days.
        Customer: Thank you so much for your help!
        Agent: You're welcome! Is there anything else I can help with?
        Customer: No, that's all. Thank you!
        Agent: Great! Thanks for calling, have a great day!
        """
        
        transcript = RecordingTranscript(
            recording_id=recording_id,
            text=mock_transcript_text,
            source="mock-generation"
        )
        db.add(transcript)
        db.commit()
    else:
        mock_transcript_text = transcripts[0].text
    
    # Update recording status to processing
    recording.status = RecordingStatus.PROCESSING
    db.commit()
    
    try:
        # Call Bedrock service for analysis
        analysis_result = bedrock_service.analyze_transcript(mock_transcript_text, recording_id)
        
        # Create analysis record
        analysis = RecordingAnalysis(
            recording_id=recording_id,
            summary=analysis_result["summary"],
            sentiment=analysis_result["sentiment"],
            agent_score=analysis_result["agent_score"],
            compliance_flags=analysis_result["compliance_flags"],
            keywords=analysis_result["keywords"],
            analysis_metadata=analysis_result["analysis_metadata"]
        )
        
        db.add(analysis)
        
        # Mark recording as completed
        recording.status = RecordingStatus.COMPLETED
        db.commit()
        db.refresh(analysis)
        
        return analysis
        
    except Exception as e:
        recording.status = RecordingStatus.FAILED
        db.commit()
        raise ValueError(f"Analysis failed: {str(e)}")


def delete_recording(db: Session, recording_id: int, current_user: User) -> None:
    """Delete a recording and its file."""
    recording = get_recording(db, recording_id, current_user)
    
    # Delete file from storage
    try:
        storage_service.delete_file(recording.file_path)
    except Exception:
        pass  # Continue even if file deletion fails
    
    # Delete from database (cascading will delete transcripts and analysis)
    db.delete(recording)
    db.commit()


def get_project_recording_stats(db: Session, project_id: int, current_user: User) -> dict:
    """Get recording statistics for a project."""
    total_recordings = db.query(func.count(Recording.id)).filter(
        Recording.project_id == project_id,
        Recording.tenant_id == current_user.tenant_id
    ).scalar()
    
    completed_analyses = db.query(func.count(RecordingAnalysis.id)).filter(
        RecordingAnalysis.recording_id.in_(
            db.query(Recording.id).filter(
                Recording.project_id == project_id,
                Recording.tenant_id == current_user.tenant_id
            )
        )
    ).scalar()
    
    avg_agent_score = db.query(func.avg(RecordingAnalysis.agent_score)).filter(
        RecordingAnalysis.recording_id.in_(
            db.query(Recording.id).filter(
                Recording.project_id == project_id,
                Recording.tenant_id == current_user.tenant_id
            )
        )
    ).scalar()
    
    return {
        "total_recordings": total_recordings or 0,
        "analyzed_recordings": completed_analyses or 0,
        "average_agent_score": float(avg_agent_score) if avg_agent_score else 0.0
    }
