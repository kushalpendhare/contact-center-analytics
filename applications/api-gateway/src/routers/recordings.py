# src/routers/recordings.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from src.core.auth import get_current_user
from src.core.database import get_db
from src.models.user import User
from src.models.project import Project
from src.models.transcript import RecordingTranscript
from src.models.analysis import RecordingAnalysis
from src.schemas.recording import (
    RecordingResponse,
    RecordingDetailResponse,
    RecordingAnalysisResponse,
    RecordingStatsResponse
)
from src.services.recording_service import (
    upload_recording,
    get_recordings,
    get_recording,
    analyze_recording,
    delete_recording,
    get_project_recording_stats
)

router = APIRouter(
    prefix="/projects",
    tags=["Recordings"]
)


@router.post(
    "/{project_id}/recordings",
    response_model=RecordingResponse
)
def upload_new_recording(
    project_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a recording file for a project."""
    
    try:
        file_data = file.file.read()
        recording = upload_recording(
            db,
            project_id,
            current_user,
            file.filename or "recording",
            file_data
        )
        return recording
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")


@router.get(
    "/{project_id}/recordings",
    response_model=list[RecordingResponse]
)
def list_recordings(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all recordings for a project."""
    
    # Verify project access
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return get_recordings(db, project_id, current_user)


@router.get(
    "/{project_id}/recordings/{recording_id}",
    response_model=RecordingDetailResponse
)
def get_recording_detail(
    project_id: int,
    recording_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recording details with transcript and analysis."""
    
    try:
        recording = get_recording(db, recording_id, current_user)
        
        if recording.project_id != project_id:
            raise HTTPException(status_code=404, detail="Recording not found in this project")
        
        # Get transcript
        transcript = db.query(RecordingTranscript).filter(
            RecordingTranscript.recording_id == recording_id
        ).first()
        
        # Get analysis
        analysis = db.query(RecordingAnalysis).filter(
            RecordingAnalysis.recording_id == recording_id
        ).first()
        
        return RecordingDetailResponse(
            recording=recording,
            transcript=transcript,
            analysis=analysis
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post(
    "/{project_id}/recordings/{recording_id}/analyze",
    response_model=RecordingAnalysisResponse
)
def analyze_recording_endpoint(
    project_id: int,
    recording_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Trigger AI analysis of a recording."""
    
    try:
        recording = get_recording(db, recording_id, current_user)
        
        if recording.project_id != project_id:
            raise HTTPException(status_code=404, detail="Recording not found in this project")
        
        analysis = analyze_recording(db, recording_id, current_user)
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@router.delete(
    "/{project_id}/recordings/{recording_id}",
    response_model=RecordingResponse
)
def delete_recording_endpoint(
    project_id: int,
    recording_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a recording and its analysis."""
    
    try:
        recording = get_recording(db, recording_id, current_user)
        
        if recording.project_id != project_id:
            raise HTTPException(status_code=404, detail="Recording not found in this project")
        
        delete_recording(db, recording_id, current_user)
        return recording
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/{project_id}/recordings/stats",
    response_model=RecordingStatsResponse
)
def get_recording_stats(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recording statistics for a project."""
    
    # Verify project access
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    stats = get_project_recording_stats(db, project_id, current_user)
    return stats
