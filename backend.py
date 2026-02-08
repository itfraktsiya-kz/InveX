import os
import json
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator, EmailStr
import jwt
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from sqlalchemy.exc import SQLAlchemyError

from database import get_db, User, Startup, Comment, Like, AnalyticsEvent, AIAnalysis, TelegramEvent, MentorshipRequest

# Настройки
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 дней

# Создаем приложение FastAPI
app = FastAPI(
    title="Startup Platform API",
    description="API для платформы стартапов с Telegram-интеграцией",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Схемы Pydantic
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)
    role: str = Field(..., regex="^(startup_owner|investor|mentor)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserTelegramLink(BaseModel):
    telegram_username: str = Field(..., regex="^@[a-zA-Z0-9_]{5,32}$")

class StartupCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=50)
    short_description: str = Field(..., max_length=500)
    stage: str = Field(..., regex="^(idea|mvp|beta|ready|scaling)$")
    category: str = Field(..., min_length=2)
    team_size: Optional[int] = Field(None, ge=1)
    project_cost: Optional[float] = Field(None, ge=0)
    monthly_expenses: Optional[float] = Field(None, ge=0)
    investment_asked: Optional[float] = Field(None, ge=0)
    traction_metrics: Optional[Dict[str, Any]] = None
    market_size: Optional[str] = None
    target_audience: Optional[str] = None
    region: Optional[str] = None
    telegram_contact: str = Field(..., regex="^@[a-zA-Z0-9_]{5,32}$")
    website: Optional[str] = None
    github: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    
    @validator('traction_metrics')
    def validate_traction_metrics(cls, v):
        if v:
            allowed_keys = {'users', 'active_users', 'revenue', 'growth', 'orders', 'downloads'}
            if not any(key in allowed_keys for key in v.keys()):
                raise ValueError('Некорректные метрики traction')
        return v

class StartupUpdate(StartupCreate):
    pass

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    startup_id: int

class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    startup_id: Optional[int] = None
    request_message: Optional[str] = None
    goals: Optional[List[str]] = None
    duration: str = Field(default="1 month")

# Вспомогательные функции
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Зависимости
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный токен авторизации"
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен истек"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить токен"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден"
        )
    
    return user

# AI Service Mock (в реальном проекте здесь будет интеграция с ИИ)
class AIService:
    @staticmethod
    def analyze_startup(startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """Анализ стартапа и генерация AI оценки"""
        # В реальном проекте здесь будет интеграция с LLM API
        # Для демо генерируем фиктивные данные
        
        # Вычисляем traction_score на основе метрик
        traction_metrics = startup_data.get("traction_metrics", {})
        traction_score = 0
        if traction_metrics:
            if "users" in traction_metrics:
                users = traction_metrics.get("users", 0)
                if users > 10000:
                    traction_score = 90
                elif users > 1000:
                    traction_score = 70
                elif users > 100:
                    traction_score = 50
                else:
                    traction_score = 30
            elif "revenue" in traction_metrics:
                revenue = traction_metrics.get("revenue", 0)
                if revenue > 10000:
                    traction_score = 85
                elif revenue > 1000:
                    traction_score = 65
                else:
                    traction_score = 40
        
        scores = {
            "overall_score": min(100, traction_score * 1.2) if traction_score > 0 else 50,
            "team_score": 75 if startup_data.get("team_size", 0) > 3 else 50,
            "market_score": 80 if startup_data.get("market_size") else 60,
            "traction_score": traction_score,
            "financial_score": 70 if startup_data.get("project_cost") else 50,
            "technology_score": 85 if startup_data.get("github") else 65
        }
        
        overall_score = sum(scores.values()) / len(scores)
        
        strengths = []
        weaknesses = []
        recommendations = []
        
        if scores["team_score"] > 70:
            strengths.append("Сильная команда")
        else:
            weaknesses.append("Недостаточный размер команды")
            recommendations.append("Расширить команду")
            
        if scores["market_score"] > 70:
            strengths.append("Перспективный рынок")
        else:
            weaknesses.append("Неопределенный целевой рынок")
            recommendations.append("Провести исследование рынка")
            
        if traction_score > 60:
            strengths.append("Хорошие метрики вовлеченности")
        elif traction_score > 0:
            weaknesses.append("Низкий тракшн")
            recommendations.append("Увеличить пользовательскую базу")
        else:
            weaknesses.append("Отсутствие тракшн-метрик")
            recommendations.append("Добавить метрики для отслеживания прогресса")
        
        if not strengths:
            strengths.append("Инновационная идея")
            
        if not recommendations:
            recommendations.append("Найти стратегических партнеров")
        
        return {
            "overall_score": overall_score,
            "detailed_scores": scores,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "investment_readiness": "high" if overall_score > 75 else "medium" if overall_score > 60 else "low"
        }
    
    @staticmethod
    def match_startup_to_investors(startup_id: int, db: Session) -> List[int]:
        """Мэтчинг стартапа с подходящими инвесторами"""
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        if not startup:
            return []
        
        # Поиск инвесторов по интересам и региону
        try:
            matched_investors = db.query(User).filter(
                User.role == "investor",
                User.is_active == True
            ).all()
            
            # Фильтруем вручную для совместимости с разными базами данных
            filtered_investors = []
            for investor in matched_investors:
                # Проверяем инвестиционные интересы
                if (investor.investment_interests and 
                    startup.category in investor.investment_interests):
                    filtered_investors.append(investor)
                # Или проверяем регион
                elif (investor.investment_regions and 
                      startup.region and 
                      startup.region in investor.investment_regions):
                    filtered_investors.append(investor)
            
            return [inv.id for inv in filtered_investors]
        except Exception as e:
            print(f"Ошибка при мэтчинге инвесторов: {e}")
            return []
    
    @staticmethod
    def match_startup_to_mentors(startup_id: int, db: Session) -> List[int]:
        """Мэтчинг стартапа с подходящими менторами"""
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        if not startup:
            return []
        
        # Поиск менторов по специализациям
        try:
            matched_mentors = db.query(User).filter(
                User.role == "mentor",
                User.is_active == True,
                User.mentor_availability == True
            ).all()
            
            # Фильтруем вручную для совместимости
            filtered_mentors = []
            for mentor in matched_mentors:
                if (mentor.mentor_specialties and 
                    startup.category in mentor.mentor_specialties):
                    filtered_mentors.append(mentor)
            
            return [mentor.id for mentor in filtered_mentors]
        except Exception as e:
            print(f"Ошибка при мэтчинге менторов: {e}")
            return []

# Telegram Service Mock (в реальном проекте здесь будет интеграция с Telegram Bot API)
class TelegramService:
    @staticmethod
    def send_notification(user_id: int, message: str, db: Session):
        """Отправка уведомления в Telegram"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.telegram_linked:
            return False
        
        try:
            # Логируем событие
            event = TelegramEvent(
                user_id=user_id,
                event_type="notification_sent",
                metadata={
                    "message_type": "notification",
                    "timestamp": datetime.utcnow().isoformat(),
                    "user_telegram": user.telegram_username,
                    "message_preview": message[:100]
                }
            )
            db.add(event)
            db.commit()
            
            # В реальном проекте здесь будет вызов Telegram Bot API
            print(f"📨 Telegram notification to {user.telegram_username}: {message}")
            return True
        except Exception as e:
            print(f"Ошибка при отправке Telegram уведомления: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def initiate_contact(user_id: int, target_user_id: int, startup_id: Optional[int] = None, db: Session = None):
        """Инициация контакта между пользователями"""
        try:
            from_user = db.query(User).filter(User.id == user_id).first()
            to_user = db.query(User).filter(User.id == target_user_id).first()
            
            if not from_user or not to_user:
                return False
            
            # Логируем событие контакта
            event = TelegramEvent(
                user_id=user_id,
                related_user_id=target_user_id,
                startup_id=startup_id,
                event_type="contact_initiated",
                metadata={
                    "action": "contact_request",
                    "timestamp": datetime.utcnow().isoformat(),
                    "from_user": from_user.telegram_username,
                    "to_user": to_user.telegram_username
                }
            )
            db.add(event)
            
            # Отправляем уведомления обоим пользователям
            startup = db.query(Startup).filter(Startup.id == startup_id).first() if startup_id else None
            
            message_to_investor = f"👋 Пользователь {from_user.name} хочет связаться с вами по стартапу '{startup.name if startup else 'проект'}'. Ответьте ему в личном Telegram чате: @{from_user.telegram_username.replace('@', '')}"
            message_to_startup_owner = f"👋 Пользователь {to_user.name} заинтересовался вашим стартапом '{startup.name if startup else 'проектом'}. Ответьте ему в личном Telegram чате: @{to_user.telegram_username.replace('@', '')}"
            
            TelegramService.send_notification(target_user_id, message_to_investor, db)
            TelegramService.send_notification(user_id, message_to_startup_owner, db)
            
            db.commit()
            return True
        except Exception as e:
            print(f"Ошибка при инициации контакта: {e}")
            db.rollback()
            return False

# ==================== API ЭНДПОИНТЫ ====================

@app.get("/")
async def root():
    return {"message": "Startup Platform API", "version": "1.0.0"}

# Аутентификация
@app.post("/api/auth/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя (этап 1)"""
    try:
        # Проверяем, существует ли пользователь
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует"
            )
        
        # Инициализируем дополнительные поля в зависимости от роли
        extra_fields = {}
        if user_data.role == "investor":
            extra_fields["investment_interests"] = []
            extra_fields["investment_regions"] = []
        elif user_data.role == "mentor":
            extra_fields["mentor_specialties"] = []
            extra_fields["mentor_experience"] = 0
            extra_fields["mentor_hourly_rate"] = None
            extra_fields["mentor_availability"] = True
        
        # Создаем пользователя
        user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            name=user_data.name,
            role=user_data.role,
            created_at=datetime.utcnow(),
            is_active=True,
            telegram_linked=False,
            **extra_fields
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Создаем токен
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "telegram_linked": user.telegram_linked
            },
            "requires_telegram_link": True  # Флаг необходимости привязки Telegram
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при регистрации: {str(e)}"
        )

@app.post("/api/auth/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Вход пользователя"""
    try:
        user = db.query(User).filter(User.email == user_data.email).first()
        
        if not user or not verify_password(user_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Аккаунт деактивирован"
            )
        
        # Создаем токен
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "telegram_linked": user.telegram_linked,
                "telegram_username": user.telegram_username
            },
            "requires_telegram_link": not user.telegram_linked
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при входе: {str(e)}"
        )

# Привязка Telegram (этап 2)
@app.post("/api/user/telegram/link")
async def link_telegram_account(
    telegram_data: UserTelegramLink,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Привязка Telegram аккаунта к пользователю"""
    try:
        # Проверяем, не привязан ли уже Telegram
        if current_user.telegram_linked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Telegram уже привязан к аккаунту"
            )
        
        # Проверяем, не используется ли username другим пользователем
        existing_user = db.query(User).filter(
            User.telegram_username == telegram_data.telegram_username,
            User.id != current_user.id
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Этот Telegram username уже используется другим пользователем"
            )
        
        # Сохраняем username (telegram_id будет установлен позже через бота)
        current_user.telegram_username = telegram_data.telegram_username
        db.commit()
        
        return {
            "message": "Telegram username сохранен. Перейдите в бота @YourStartupBot и отправьте /start для завершения привязки.",
            "telegram_username": current_user.telegram_username,
            "bot_username": "@YourStartupBot"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при привязке Telegram: {str(e)}"
        )

@app.post("/api/user/telegram/confirm")
async def confirm_telegram_link(
    telegram_id: str,
    telegram_username: str,
    db: Session = Depends(get_db)
):
    """Подтверждение привязки Telegram через webhook от бота"""
    try:
        user = db.query(User).filter(User.telegram_username == telegram_username).first()
        
        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"detail": "Пользователь не найден"}
            )
        
        user.telegram_id = telegram_id
        user.telegram_linked = True
        user.telegram_linked_at = datetime.utcnow()
        db.commit()
        
        # Отправляем приветственное уведомление
        TelegramService.send_notification(
            user.id,
            f"✅ Telegram успешно привязан к аккаунту {user.email}! Теперь вы будете получать уведомления о ваших стартапах.",
            db
        )
        
        return {"message": "Telegram успешно привязан"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при подтверждении Telegram: {str(e)}"
        )

# Стартапы
@app.get("/api/startups")
async def get_startups(
    skip: int = 0,
    limit: int = 12,
    category: Optional[str] = None,
    stage: Optional[str] = None,
    region: Optional[str] = None,
    min_score: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Получение списка стартапов с фильтрацией"""
    try:
        query = db.query(Startup).filter(
            Startup.is_published == True,
            Startup.is_approved == True
        )
        
        # Применяем фильтры
        if category:
            query = query.filter(Startup.category == category)
        if stage:
            query = query.filter(Startup.stage == stage)
        if region:
            query = query.filter(Startup.region == region)
        if min_score:
            query = query.filter(Startup.ai_score >= min_score)
        
        # Сортировка по AI Score и дате
        query = query.order_by(desc(Startup.ai_score), desc(Startup.created_at))
        
        total = query.count()
        startups = query.offset(skip).limit(limit).all()
        
        # Логируем просмотр если пользователь авторизован
        if current_user:
            for startup in startups:
                event = AnalyticsEvent(
                    event_type="view",
                    user_id=current_user.id,
                    user_role=current_user.role,
                    startup_id=startup.id,
                    metadata={"source": "catalog", "page": skip // limit + 1}
                )
                db.add(event)
                
                # Увеличиваем счетчик просмотров
                startup.views_count += 1
            db.commit()
        
        return {
            "startups": [{
                "id": s.id,
                "name": s.name,
                "short_description": s.short_description,
                "stage": s.stage,
                "category": s.category,
                "ai_score": s.ai_score,
                "views_count": s.views_count,
                "likes_count": s.likes_count,
                "region": s.region,
                "created_at": s.created_at.isoformat() if s.created_at else None
            } for s in startups],
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении стартапов: {str(e)}"
        )

@app.get("/api/startups/{startup_id}")
async def get_startup(
    startup_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Получение детальной информации о стартапе"""
    try:
        startup = db.query(Startup).filter(
            Startup.id == startup_id,
            Startup.is_published == True,
            Startup.is_approved == True
        ).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        # Логируем детальный просмотр если пользователь авторизован
        if current_user:
            event = AnalyticsEvent(
                event_type="view",
                user_id=current_user.id,
                user_role=current_user.role,
                startup_id=startup.id,
                metadata={"source": "detail_page", "user_role": current_user.role}
            )
            db.add(event)
            
            # Отправляем уведомление владельцу стартапа если просмотрел инвестор
            if current_user.role == "investor" and startup.owner_id != current_user.id:
                TelegramService.send_notification(
                    startup.owner_id,
                    f"👀 Инвестор {current_user.name} просмотрел ваш стартап '{startup.name}'",
                    db
                )
            
            startup.views_count += 1
            db.commit()
        
        return {
            "id": startup.id,
            "name": startup.name,
            "description": startup.description,
            "short_description": startup.short_description,
            "stage": startup.stage,
            "category": startup.category,
            "team_size": startup.team_size,
            "project_cost": startup.project_cost,
            "monthly_expenses": startup.monthly_expenses,
            "investment_asked": startup.investment_asked,
            "traction_metrics": startup.traction_metrics,
            "market_size": startup.market_size,
            "target_audience": startup.target_audience,
            "region": startup.region,
            "telegram_contact": startup.telegram_contact,
            "website": startup.website,
            "github": startup.github,
            "contact_email": startup.contact_email,
            "ai_score": startup.ai_score,
            "investment_readiness": startup.investment_readiness,
            "views_count": startup.views_count,
            "likes_count": startup.likes_count,
            "comments_count": startup.comments_count,
            "owner_id": startup.owner_id,
            "created_at": startup.created_at.isoformat() if startup.created_at else None,
            "owner": {
                "id": startup.owner.id,
                "name": startup.owner.name,
                "role": startup.owner.role
            } if startup.owner else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении стартапа: {str(e)}"
        )

# Функция для фоновой задачи
def run_startup_matching(startup_id: int, db: Session):
    """Запуск мэтчинга стартапа с инвесторами и менторами"""
    try:
        # Создаем новую сессию для фоновой задачи
        from database import SessionLocal
        local_db = SessionLocal()
        
        try:
            ai_record = local_db.query(AIAnalysis).filter(AIAnalysis.startup_id == startup_id).first()
            if not ai_record:
                return
            
            # Мэтчинг с инвесторами
            matched_investors = AIService.match_startup_to_investors(startup_id, local_db)
            ai_record.matched_investors = matched_investors
            
            # Мэтчинг с менторами
            matched_mentors = AIService.match_startup_to_mentors(startup_id, local_db)
            ai_record.matched_mentors = matched_mentors
            
            # Сохраняем причины мэтчинга
            startup = local_db.query(Startup).filter(Startup.id == startup_id).first()
            if startup:
                ai_record.match_reasons = {
                    "investors": f"Соответствие категории {startup.category} и региона {startup.region}",
                    "mentors": f"Специализация в {startup.category} и стадии {startup.stage}"
                }
            
            local_db.commit()
            
            # Отправляем уведомления подходящим инвесторам
            for investor_id in matched_investors[:5]:  # Ограничиваем 5 уведомлениями
                TelegramService.send_notification(
                    investor_id,
                    f"🎯 Найден подходящий стартап для вас: '{startup.name}' ({startup.category}, оценка AI: {startup.ai_score:.1f}/100)",
                    local_db
                )
        finally:
            local_db.close()
    except Exception as e:
        print(f"Ошибка при мэтчинге стартапа {startup_id}: {e}")

@app.post("/api/startups")
async def create_startup(
    startup_data: StartupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    backgroundtasks: BackgroundTasks = Depends(get_background_tasks)
):
    """Создание нового стартапа"""
    try:
        # Проверяем, что пользователь имеет право создавать стартапы
        if current_user.role not in ["startup_owner", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Только владельцы стартапов могут создавать проекты"
            )
        
        # Проверяем наличие обязательного поля Telegram
        if not startup_data.telegram_contact:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Telegram контакт обязателен для публикации"
            )
        
        # AI-проверка качества перед сохранением
        ai_analysis = AIService.analyze_startup(startup_data.dict())
        
        # Создаем стартап
        startup = Startup(
            **startup_data.dict(),
            owner_id=current_user.id,
            ai_score=ai_analysis["overall_score"],
            investment_readiness=ai_analysis["investment_readiness"],
            created_at=datetime.utcnow(),
            is_published=False,  # Не публикуем сразу, нужна модерация
            is_approved=False,
            views_count=0,
            likes_count=0,
            comments_count=0
        )
        
        db.add(startup)
        db.commit()
        db.refresh(startup)
        
        # Сохраняем AI анализ
        ai_record = AIAnalysis(
            startup_id=startup.id,
            overall_score=ai_analysis["overall_score"],
            team_score=ai_analysis["detailed_scores"]["team_score"],
            market_score=ai_analysis["detailed_scores"]["market_score"],
            traction_score=ai_analysis["detailed_scores"]["traction_score"],
            financial_score=ai_analysis["detailed_scores"]["financial_score"],
            technology_score=ai_analysis["detailed_scores"]["technology_score"],
            strengths=ai_analysis["strengths"],
            weaknesses=ai_analysis["weaknesses"],
            recommendations=ai_analysis["recommendations"],
            created_at=datetime.utcnow()
        )
        db.add(ai_record)
        db.commit()
        
        # Запускаем мэтчинг в фоне
        background_tasks.add_task(run_startup_matching, startup.id)
        
        # Отправляем уведомление владельцу
        TelegramService.send_notification(
            current_user.id,
            f"✅ Ваш стартап '{startup.name}' успешно создан! AI оценка: {ai_analysis['overall_score']:.1f}/100. Проект отправлен на модерацию.",
            db
        )
        
        return {
            "message": "Стартап успешно создан и отправлен на модерацию",
            "startup": {
                "id": startup.id,
                "name": startup.name,
                "short_description": startup.short_description,
                "stage": startup.stage,
                "category": startup.category,
                "ai_score": startup.ai_score,
                "investment_readiness": startup.investment_readiness,
                "created_at": startup.created_at.isoformat() if startup.created_at else None
            },
            "ai_analysis": ai_analysis
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании стартапа: {str(e)}"
        )

# Лайки
@app.post("/api/startups/{startup_id}/like")
async def like_startup(
    startup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Поставить/убрать лайк стартапу"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        # Проверяем, не лайкнул ли уже пользователь
        existing_like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.startup_id == startup_id
        ).first()
        
        if existing_like:
            # Убираем лайк
            db.delete(existing_like)
            startup.likes_count = max(0, startup.likes_count - 1)
            action = "unliked"
        else:
            # Ставим лайк
            like = Like(user_id=current_user.id, startup_id=startup_id)
            db.add(like)
            startup.likes_count += 1
            action = "liked"
            
            # Логируем событие
            event = AnalyticsEvent(
                event_type="like",
                user_id=current_user.id,
                user_role=current_user.role,
                startup_id=startup_id,
                metadata={"action": "like"}
            )
            db.add(event)
            
            # Отправляем уведомление владельцу если лайкнул инвестор
            if current_user.role == "investor" and startup.owner_id != current_user.id:
                TelegramService.send_notification(
                    startup.owner_id,
                    f"❤️ Инвестор {current_user.name} поставил лайк вашему стартапу '{startup.name}'",
                    db
                )
        
        db.commit()
        
        # Пересчитываем AI score
        update_startup_score(startup_id, db)
        
        return {"action": action, "likes_count": startup.likes_count}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при обработке лайка: {str(e)}"
        )

def update_startup_score(startup_id: int, db: Session):
    """Обновление AI оценки стартапа на основе новых данных"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        if not startup:
            return
        
        # Простая формула для демо (в реальном проекте сложнее)
        engagement_score = min(100, (startup.likes_count * 5) + (startup.comments_count * 10))
        traction_score = startup.traction_score or 0
        new_score = (engagement_score * 0.3) + (traction_score * 0.4) + (startup.ai_score * 0.3)
        
        startup.ai_score = min(100, new_score)
        
        # Обновляем AI анализ
        ai_record = db.query(AIAnalysis).filter(AIAnalysis.startup_id == startup_id).first()
        if ai_record:
            ai_record.overall_score = startup.ai_score
            ai_record.updated_at = datetime.utcnow()
        
        db.commit()
    except Exception as e:
        print(f"Ошибка при обновлении оценки стартапа {startup_id}: {e}")
        db.rollback()

# Комментарии
@app.get("/api/startups/{startup_id}/comments")
async def get_comments(
    startup_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Получение публичных комментариев к стартапу"""
    try:
        comments = db.query(Comment).filter(
            Comment.startup_id == startup_id,
            Comment.is_public == True
        ).order_by(desc(Comment.created_at)).offset(skip).limit(limit).all()
        
        return {
            "comments": [
                {
                    "id": comment.id,
                    "content": comment.content,
                    "author_name": comment.author.name,
                    "author_role": comment.author.role,
                    "created_at": comment.created_at.isoformat() if comment.created_at else None
                }
                for comment in comments
            ],
            "total": db.query(Comment).filter(
                Comment.startup_id == startup_id, 
                Comment.is_public == True
            ).count()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении комментариев: {str(e)}"
        )

@app.post("/api/startups/{startup_id}/comments")
async def create_comment(
    startup_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создание публичного комментария"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        comment = Comment(
            content=comment_data.content,
            author_id=current_user.id,
            startup_id=startup_id,
            created_at=datetime.utcnow(),
            is_public=True
        )
        
        db.add(comment)
        startup.comments_count += 1
        
        # Логируем событие
        event = AnalyticsEvent(
            event_type="comment",
            user_id=current_user.id,
            user_role=current_user.role,
            startup_id=startup_id,
            metadata={"comment_length": len(comment_data.content)}
        )
        db.add(event)
        
        # Отправляем уведомление владельцу
        if startup.owner_id != current_user.id:
            TelegramService.send_notification(
                startup.owner_id,
                f"💬 {current_user.name} оставил комментарий к вашему стартапу '{startup.name}': '{comment_data.content[:50]}...'",
                db
            )
        
        db.commit()
        
        # Пересчитываем AI score
        update_startup_score(startup_id, db)
        
        return {
            "message": "Комментарий успешно добавлен",
            "comment": {
                "id": comment.id,
                "content": comment.content,
                "author_name": current_user.name,
                "created_at": comment.created_at.isoformat()
            }
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании комментария: {str(e)}"
        )

# Контакт через Telegram
@app.post("/api/startups/{startup_id}/contact")
async def contact_startup_owner(
    startup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Инициация контакта с владельцем стартапа через Telegram"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        # Проверяем, привязан ли Telegram у обоих пользователей
        if not current_user.telegram_linked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Сначала привяжите ваш Telegram аккаунт"
            )
        
        if not startup.owner.telegram_linked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Владелец стартапа еще не привязал Telegram"
            )
        
        # Инициируем контакт через Telegram
        success = TelegramService.initiate_contact(
            user_id=current_user.id,
            target_user_id=startup.owner_id,
            startup_id=startup_id,
            db=db
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось инициировать контакт"
            )
        
        # Логируем событие
        event = AnalyticsEvent(
            event_type="contact_click",
            user_id=current_user.id,
            user_role=current_user.role,
            startup_id=startup_id,
            metadata={"action": "telegram_contact_initiated"}
        )
        db.add(event)
        db.commit()
        
        return {
            "message": "Контакт инициирован. Проверьте ваш Telegram для дальнейшего общения.",
            "telegram_contact": startup.telegram_contact
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при инициации контакта: {str(e)}"
        )

# Менторство
@app.get("/api/mentors")
async def get_mentors(
    skip: int = 0,
    limit: int = 12,
    specialty: Optional[str] = None,
    min_experience: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Получение списка менторов"""
    try:
        query = db.query(User).filter(
            User.role == "mentor",
            User.is_active == True,
            User.mentor_availability == True
        )
        
        if specialty:
            # Простая фильтрация для совместимости
            mentors = query.all()
            filtered_mentors = []
            for mentor in mentors:
                if (mentor.mentor_specialties and 
                    specialty in mentor.mentor_specialties):
                    filtered_mentors.append(mentor)
            mentors = filtered_mentors
        else:
            mentors = query.all()
        
        if min_experience:
            mentors = [m for m in mentors if m.mentor_experience >= min_experience]
        
        # Сортируем по опыту
        mentors.sort(key=lambda x: x.mentor_experience or 0, reverse=True)
        
        paginated_mentors = mentors[skip:skip + limit]
        
        return {
            "mentors": [
                {
                    "id": mentor.id,
                    "name": mentor.name,
                    "bio": mentor.bio,
                    "specialties": mentor.mentor_specialties,
                    "experience": mentor.mentor_experience,
                    "hourly_rate": mentor.mentor_hourly_rate,
                    "telegram_username": mentor.telegram_username
                }
                for mentor in paginated_mentors
            ],
            "total": len(mentors),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении менторов: {str(e)}"
        )

@app.post("/api/mentorship/request")
async def create_mentorship_request(
    request_data: MentorshipRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создание запроса на менторство"""
    try:
        # Проверяем, что целевой пользователь - ментор
        mentor = db.query(User).filter(
            User.id == request_data.mentor_id,
            User.role == "mentor",
            User.is_active == True
        ).first()
        
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ментор не найден"
            )
        
        # Проверяем, привязан ли Telegram у обоих пользователей
        if not current_user.telegram_linked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Сначала привяжите ваш Telegram аккаунт"
            )
        
        if not mentor.telegram_linked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ментор еще не привязал Telegram"
            )
        
        # Проверяем, нет ли уже активного запроса
        existing_request = db.query(MentorshipRequest).filter(
            MentorshipRequest.mentee_id == current_user.id,
            MentorshipRequest.mentor_id == request_data.mentor_id,
            MentorshipRequest.status.in_(["pending", "accepted"])
        ).first()
        
        if existing_request:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="У вас уже есть активный запрос к этому ментору"
            )
        
        # Создаем запрос
        mentorship_request = MentorshipRequest(
            mentee_id=current_user.id,
            mentor_id=request_data.mentor_id,
            startup_id=request_data.startup_id,
            request_message=request_data.request_message,
            goals=request_data.goals,
            duration=request_data.duration,
            status="pending",
            created_at=datetime.utcnow()
        )
        
        db.add(mentorship_request)
        db.commit()
        db.refresh(mentorship_request)
        
        # Отправляем уведомление ментору
        startup = db.query(Startup).filter(Startup.id == request_data.startup_id).first() if request_data.startup_id else None
        startup_name = startup.name if startup else "проекту"
        
        TelegramService.send_notification(
            request_data.mentor_id,
            f"👥 Пользователь {current_user.name} отправил вам запрос на менторство по стартапу '{startup_name}'. Проверьте заявку в личном кабинете.",
            db
        )
        
        # Инициируем Telegram контакт
        TelegramService.initiate_contact(
            user_id=current_user.id,
            target_user_id=request_data.mentor_id,
            startup_id=request_data.startup_id,
            db=db
        )
        
        return {
            "message": "Запрос на менторство успешно отправлен",
            "request_id": mentorship_request.id
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании запроса на менторство: {str(e)}"
        )

# Аналитика
@app.get("/api/analytics/startup/{startup_id}")
async def get_startup_analytics(
    startup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение аналитики по стартапу"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        # Проверяем права доступа
        if current_user.id != startup.owner_id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет прав для просмотра аналитики"
            )
        
        # Получаем события аналитики
        events = db.query(AnalyticsEvent).filter(
            AnalyticsEvent.startup_id == startup_id
        ).order_by(desc(AnalyticsEvent.created_at)).limit(100).all()
        
        # Агрегируем данные
        views_by_role = {}
        likes_by_role = {}
        contact_clicks = 0
        
        for event in events:
            if event.event_type == "view":
                views_by_role[event.user_role] = views_by_role.get(event.user_role, 0) + 1
            elif event.event_type == "like":
                likes_by_role[event.user_role] = likes_by_role.get(event.user_role, 0) + 1
            elif event.event_type == "contact_click":
                contact_clicks += 1
        
        # Получаем AI анализ
        ai_analysis = db.query(AIAnalysis).filter(AIAnalysis.startup_id == startup_id).first()
        
        return {
            "startup": {
                "id": startup.id,
                "name": startup.name,
                "category": startup.category,
                "stage": startup.stage,
                "ai_score": startup.ai_score,
                "views_count": startup.views_count,
                "likes_count": startup.likes_count,
                "comments_count": startup.comments_count
            },
            "analytics": {
                "total_views": startup.views_count,
                "total_likes": startup.likes_count,
                "total_comments": startup.comments_count,
                "views_by_role": views_by_role,
                "likes_by_role": likes_by_role,
                "contact_clicks": contact_clicks,
                "conversion_rate": round((contact_clicks / startup.views_count * 100), 2) if startup.views_count > 0 else 0
            },
            "ai_analysis": {
                "overall_score": ai_analysis.overall_score if ai_analysis else None,
                "matched_investors": ai_analysis.matched_investors if ai_analysis else [],
                "matched_mentors": ai_analysis.matched_mentors if ai_analysis else [],
                "recommendations": ai_analysis.recommendations if ai_analysis else [],
                "strengths": ai_analysis.strengths if ai_analysis else [],
                "weaknesses": ai_analysis.weaknesses if ai_analysis else []
            } if ai_analysis else None,
            "recent_events": [
                {
                    "type": event.event_type,
                    "user_role": event.user_role,
                    "timestamp": event.created_at.isoformat() if event.created_at else None,
                    "metadata": event.metadata
                }
                for event in events[:20]
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении аналитики: {str(e)}"
        )

# AI-мэтчинг
@app.get("/api/ai/matching/startup/{startup_id}")
async def get_startup_matches(
    startup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получение AI-мэтчинга для стартапа"""
    try:
        startup = db.query(Startup).filter(Startup.id == startup_id).first()
        
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Стартап не найден"
            )
        
        # Проверяем права доступа
        if current_user.id != startup.owner_id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет прав для просмотра мэтчинга"
            )
        
        ai_analysis = db.query(AIAnalysis).filter(AIAnalysis.startup_id == startup_id).first()
        if not ai_analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI анализ не найден"
            )
        
        # Получаем детальную информацию о подобранных инвесторах и менторах
        matched_investors = db.query(User).filter(User.id.in_(ai_analysis.matched_investors or [])).all()
        matched_mentors = db.query(User).filter(User.id.in_(ai_analysis.matched_mentors or [])).all()
        
        return {
            "startup": {
                "id": startup.id,
                "name": startup.name,
                "category": startup.category,
                "stage": startup.stage,
                "region": startup.region,
                "ai_score": startup.ai_score
            },
            "matches": {
                "investors": [
                    {
                        "id": investor.id,
                        "name": investor.name,
                        "interests": investor.investment_interests,
                        "investment_range": investor.investment_range,
                        "telegram_username": investor.telegram_username
                    }
                    for investor in matched_investors
                ],
                "mentors": [
                    {
                        "id": mentor.id,
                        "name": mentor.name,
                        "specialties": mentor.mentor_specialties,
                        "experience": mentor.mentor_experience,
                        "telegram_username": mentor.telegram_username
                    }
                    for mentor in matched_mentors
                ]
            },
            "match_reasons": ai_analysis.match_reasons,
            "ai_score": ai_analysis.overall_score,
            "total_matches": {
                "investors": len(matched_investors),
                "mentors": len(matched_mentors)
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при получении мэтчинга: {str(e)}"
        )

# Webhook для Telegram бота
@app.post("/api/webhook/telegram")
async def telegram_webhook(
    data: dict,
    db: Session = Depends(get_db)
):
    """Webhook для обработки событий от Telegram бота"""
    try:
        # В реальном проекте здесь будет обработка событий от Telegram
        # Для демо просто логируем полученные данные
        
        event = TelegramEvent(
            event_type="telegram_webhook_received",
            metadata=data,
            created_at=datetime.utcnow()
        )
        db.add(event)
        db.commit()
        
        return {"status": "received", "message": "Webhook успешно обработан"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при обработке webhook: {str(e)}"
        )

# Health check
@app.get("/api/health")
async def health_check():
    """Проверка здоровья API"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "startup-platform-api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)