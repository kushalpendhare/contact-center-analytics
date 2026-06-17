# src/services/bedrock_service.py

import random
import json
from datetime import datetime


class BedrockService:
    """Mock Bedrock service for local testing. Will be replaced with real AWS Bedrock calls."""

    def __init__(self, use_mock: bool = True):
        self.use_mock = use_mock
        self.model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    def analyze_transcript(self, transcript_text: str, recording_id: int) -> dict:
        """
        Analyze a transcript using Claude (mocked locally).
        
        Returns:
        {
            "summary": "...",
            "sentiment": "positive|neutral|negative",
            "agent_score": 0-100,
            "compliance_flags": {"pii_detected": bool, "regulatory_issues": [...]},
            "keywords": ["kw1", "kw2", ...],
            "analysis_metadata": {"model": "...", "tokens": int, "cost": float}
        }
        """
        if self.use_mock:
            return self._mock_analysis(transcript_text, recording_id)
        else:
            return self._real_bedrock_analysis(transcript_text, recording_id)

    def _mock_analysis(self, transcript_text: str, recording_id: int) -> dict:
        """Generate deterministic mock analysis results for testing."""
        
        # Deterministic but varied based on text length and recording_id
        text_length = len(transcript_text)
        sentiment_choice = (recording_id + text_length) % 3
        sentiments = ["positive", "neutral", "negative"]
        sentiment = sentiments[sentiment_choice]
        
        agent_score = 65 + (recording_id % 30)  # 65-95 range
        
        # Mock PII detection based on keywords in transcript
        pii_detected = any(keyword in transcript_text.lower() for keyword in ["phone", "email", "ssn", "account"])
        
        regulatory_issues = []
        if "refund" in transcript_text.lower():
            regulatory_issues.append("potential_refund_issue")
        if "complaint" in transcript_text.lower():
            regulatory_issues.append("customer_complaint")
        
        keywords = self._extract_mock_keywords(transcript_text)
        
        return {
            "summary": f"Call between customer and agent. {len(transcript_text)} characters analyzed. Customer sentiment appears {sentiment}. Agent handled the call with {agent_score} score.",
            "sentiment": sentiment,
            "agent_score": agent_score,
            "compliance_flags": {
                "pii_detected": pii_detected,
                "regulatory_issues": regulatory_issues
            },
            "keywords": keywords,
            "analysis_metadata": {
                "model": self.model_id,
                "tokens": max(100, len(transcript_text) // 4),
                "cost": 0.003,  # Mock cost
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    def _real_bedrock_analysis(self, transcript_text: str, recording_id: int) -> dict:
        """Call real AWS Bedrock Claude model (not implemented for local testing)."""
        raise NotImplementedError("Real Bedrock calls require AWS credentials and are not available in local testing")

    def _extract_mock_keywords(self, transcript_text: str) -> list:
        """Extract mock keywords from transcript."""
        common_words = {"support", "help", "issue", "problem", "solution", "please", "thank", "billing", "account"}
        words = transcript_text.lower().split()
        keywords = [w.strip(",.!?;:") for w in words if w.strip(",.!?;:") in common_words]
        return list(set(keywords))[:5]  # Return up to 5 unique keywords


# Global mock service instance
bedrock_service = BedrockService(use_mock=True)
