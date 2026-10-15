"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Literal
from datetime import datetime


# Authentication Models
class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str
    email: str
    name: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: User


# Detection Models
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1)


class FileAnalysisRequest(BaseModel):
    file_name: str
    file_size: int = Field(..., ge=0)
    file_type: str


class DetectionDetails(BaseModel):
    suspiciousPatterns: List[str]
    riskFactors: List[str]
    safetyScore: int = Field(..., ge=0, le=100)


class DetectionResult(BaseModel):
    isSpam: bool
    isMalware: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    threatLevel: Literal['safe', 'low', 'medium', 'high', 'critical']
    reasons: List[str]
    details: DetectionDetails


# Scan History Models
class ScanHistoryItem(BaseModel):
    id: str
    type: Literal['text', 'file']
    timestamp: str
    result: DetectionResult
    preview: str
