import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, Float, DateTime, JSON, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from sqlalchemy.sql import func
import uuid

# Настройки базы данных
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/startup_platform")

# Создаем движок базы данных
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==================== ТАБЛИЦЫ БАЗЫ ДАННЫХ ====================

# Таблица связи для многие-ко-многим (лайки)
startup_likes = Table(
    'startup_likes',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('startup_id', Integer, ForeignKey('startups.id')),
    Column('created_at', DateTime, default=datetime.utcnow)
)

# Таблица связи для многие-ко-многим (просмотры)
startup_views = Table(
    'startup_views',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('startup_id', Integer, ForeignKey('startups.id')),
    Column('created_at', DateTime, default=datetime.utcnow)
)

class User(Base):
    """Пользователи платформы"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100))
    role = Column(String(50), nullable=False)  # startup_owner, investor, mentor, admin
    bio = Column(Text)
    skills = Column(JSON)  # Список навыков
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Telegram привязка
    telegram_id = Column(String(100), unique=True, index=True)
    telegram_username = Column(String(100))
    telegram_linked = Column(Boolean, default=False)
    telegram_linked_at = Column(DateTime)
    
    # Для инвесторов
    investment_interests = Column(JSON)  # Категории интересов
    investment_range = Column(JSON)  # Диапазон инвестиций
    investment_regions = Column(JSON)  # Регионы инвестирования
    
    # Для менторов
    mentor_specialties = Column(JSON)  # Специализации ментора
    mentor_experience = Column(Integer)  # Опыт в годах
    mentor_hourly_rate = Column(Float)
    mentor_availability = Column(Boolean, default=True)
    
    # Связи
    startups = relationship("Startup", back_populates="owner")
    comments = relationship("Comment", back_populates="author")
    mentorship_requests_sent = relationship("MentorshipRequest", foreign_keys="MentorshipRequest.mentee_id", back_populates="mentee")
    mentorship_requests_received = relationship("MentorshipRequest", foreign_keys="MentorshipRequest.mentor_id", back_populates="mentor")
    telegram_events = relationship("TelegramEvent", back_populates="user")
    likes = relationship("Startup", secondary=startup_likes, back_populates="liked_by")
    viewed_startups = relationship("Startup", secondary=startup_views, back_populates="viewed_by")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "skills": self.skills,
            "telegram_linked": self.telegram_linked,
            "telegram_username": self.telegram_username,
            "investment_interests": self.investment_interests,
            "mentor_specialties": self.mentor_specialties
        }


class Startup(Base):
    """Стартапы"""
    __tablename__ = "startups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500))
    
    # Основные метрики
    stage = Column(String(50), nullable=False)  # idea, mvp, beta, ready, scaling
    category = Column(String(100), nullable=False)
    team_size = Column(Integer)
    founded_date = Column(DateTime)
    
    # Финансы
    project_cost = Column(Float)
    monthly_expenses = Column(Float)
    investment_asked = Column(Float)
    valuation = Column(Float)
    
    # Traction
    traction_metrics = Column(JSON)  # {"users": 1000, "revenue": 5000, "growth": 15}
    traction_score = Column(Float, default=0)
    
    # Рынок
    market_size = Column(String(100))
    target_audience = Column(Text)
    region = Column(String(100))
    
    # Контакты
    telegram_contact = Column(String(100), nullable=False)  # Обязательное поле
    website = Column(String(255))
    github = Column(String(255))
    contact_email = Column(String(255))
    
    # Визуальные материалы
    logo_url = Column(String(500))
    pitch_deck_url = Column(String(500))
    demo_video_url = Column(String(500))
    
    # Статистика
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    ai_score = Column(Float, default=0)
    investment_readiness = Column(String(50), default="low")  # low, medium, high, excellent
    
    # Системные поля
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_published = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    owner = relationship("User", back_populates="startups")
    comments = relationship("Comment", back_populates="startup", cascade="all, delete-orphan")
    ai_analysis = relationship("AIAnalysis", back_populates="startup", uselist=False)
    analytics_events = relationship("AnalyticsEvent", back_populates="startup")
    liked_by = relationship("User", secondary=startup_likes, back_populates="likes")
    viewed_by = relationship("User", secondary=startup_views, back_populates="viewed_startups")
    
    def to_dict(self, include_details=False):
        data = {
            "id": self.id,
            "name": self.name,
            "short_description": self.short_description,
            "stage": self.stage,
            "category": self.category,
            "views_count": self.views_count,
            "likes_count": self.likes_count,
            "comments_count": self.comments_count,
            "ai_score": self.ai_score,
            "investment_readiness": self.investment_readiness,
            "traction_score": self.traction_score,
            "telegram_contact": self.telegram_contact,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "owner_name": self.owner.name if self.owner else None
        }
        
        if include_details:
            data.update({
                "description": self.description,
                "team_size": self.team_size,
                "project_cost": self.project_cost,
                "monthly_expenses": self.monthly_expenses,
                "investment_asked": self.investment_asked,
                "traction_metrics": self.traction_metrics,
                "market_size": self.market_size,
                "target_audience": self.target_audience,
                "region": self.region,
                "website": self.website,
                "github": self.github,
                "contact_email": self.contact_email,
                "logo_url": self.logo_url,
                "owner": self.owner.to_dict() if self.owner else None
            })
        
        return data


class Comment(Base):
    """Публичные комментарии к стартапам (не чат!)"""
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_public = Column(Boolean, default=True)
    
    # Связи
    author = relationship("User", back_populates="comments")
    startup = relationship("Startup", back_populates="comments")


class Like(Base):
    """Лайки стартапов"""
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Уникальный индекс на пару user-startup
    __table_args__ = (UniqueConstraint('user_id', 'startup_id', name='_user_startup_uc'),)


class AnalyticsEvent(Base):
    """События аналитики"""
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)  # view, click, contact_click, like, comment
    user_id = Column(Integer, ForeignKey("users.id"))
    startup_id = Column(Integer, ForeignKey("startups.id"))
    user_role = Column(String(50))  # startup_owner, investor, mentor
    metadata = Column(JSON)  # Дополнительные данные события
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    startup = relationship("Startup", back_populates="analytics_events")
    user = relationship("User")


class AIAnalysis(Base):
    """AI-анализ стартапов"""
    __tablename__ = "ai_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), unique=True, nullable=False)
    overall_score = Column(Float, nullable=False)
    
    # Детальная оценка
    team_score = Column(Float)
    market_score = Column(Float)
    traction_score = Column(Float)
    financial_score = Column(Float)
    technology_score = Column(Float)
    
    # Рекомендации
    strengths = Column(JSON)  # Список сильных сторон
    weaknesses = Column(JSON)  # Список слабых сторон
    recommendations = Column(JSON)  # Рекомендации по улучшению
    
    # Мэтчинг
    matched_investors = Column(JSON)  # Список ID подходящих инвесторов
    matched_mentors = Column(JSON)  # Список ID подходящих менторов
    match_reasons = Column(JSON)  # Причины мэтчинга
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи
    startup = relationship("Startup", back_populates="ai_analysis")


class TelegramEvent(Base):
    """События Telegram (лог фактов общения, без текста сообщений)"""
    __tablename__ = "telegram_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)  # contact_initiated, mentor_connected, message_sent, notification_sent
    user_id = Column(Integer, ForeignKey("users.id"))
    related_user_id = Column(Integer, ForeignKey("users.id"))  # Второй участник события
    startup_id = Column(Integer, ForeignKey("startups.id"))
    
    # Только метаданные, НЕ текст сообщений
    metadata = Column(JSON)  # {"action": "contact_request", "timestamp": "2024-...", "channel": "telegram"}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    user = relationship("User", foreign_keys=[user_id], back_populates="telegram_events")
    related_user = relationship("User", foreign_keys=[related_user_id])
    startup = relationship("Startup")


class MentorshipRequest(Base):
    """Заявки на менторство"""
    __tablename__ = "mentorship_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    
    # Детали запроса
    request_message = Column(Text)
    goals = Column(JSON)  # Цели менторства
    duration = Column(String(50))  # Длительность (1 month, 3 months, etc.)
    
    # Статус
    status = Column(String(50), default="pending")  # pending, accepted, rejected, completed
    response_message = Column(Text)
    
    # Telegram связь
    telegram_chat_started = Column(Boolean, default=False)
    telegram_chat_id = Column(String(100))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Связи
    mentee = relationship("User", foreign_keys=[mentee_id], back_populates="mentorship_requests_sent")
    mentor = relationship("User", foreign_keys=[mentor_id], back_populates="mentorship_requests_received")
    startup = relationship("Startup")


# ==================== ФУНКЦИИ БАЗЫ ДАННЫХ ====================

def init_db():
    """Инициализация базы данных (создание таблиц)"""
    Base.metadata.create_all(bind=engine)
    print("✅ База данных инициализирована")


def get_db():
    """Получение сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_test_data(db: Session):
    """Создание тестовых данных"""
    # Очищаем демо-данные если есть
    db.query(Startup).delete()
    db.query(User).delete()
    db.commit()
    
    # Создаем тестовых пользователей
    users = [
        User(
            email="startup_owner@example.com",
            password_hash="hashed_password_1",
            name="Алексей Стартапов",
            role="startup_owner",
            bio="Основатель нескольких IT-стартапов",
            skills=["AI", "Разработка", "Маркетинг"],
            telegram_linked=True,
            telegram_username="@startup_alex"
        ),
        User(
            email="investor@example.com",
            password_hash="hashed_password_2",
            name="Мария Инвесторова",
            role="investor",
            bio="Венчурный инвестор, специализация на IT и AI",
            investment_interests=["AI", "FinTech", "HealthTech"],
            investment_range={"min": 10000, "max": 500000},
            telegram_linked=True,
            telegram_username="@investor_maria"
        ),
        User(
            email="mentor@example.com",
            password_hash="hashed_password_3",
            name="Дмитрий Менторов",
            role="mentor",
            bio="Эксперт по масштабированию стартапов, 15 лет опыта",
            mentor_specialties=["Scaling", "Fundraising", "Team Building"],
            mentor_experience=15,
            telegram_linked=True,
            telegram_username="@mentor_dmitry"
        )
    ]
    
    for user in users:
        db.add(user)
    db.commit()
    
    # Создаем тестовые стартапы
    startups = [
        Startup(
            name="AI Health Assistant",
            description="ИИ-ассистент для мониторинга здоровья и рекомендаций",
            short_description="Интеллектуальный помощник для контроля здоровья",
            stage="beta",
            category="HealthTech",
            team_size=8,
            project_cost=250000,
            monthly_expenses=15000,
            investment_asked=500000,
            traction_metrics={"users": 1500, "active_users": 300, "revenue": 25000},
            traction_score=75,
            market_size="3B",
            target_audience="Люди 30-60 лет, заботящиеся о здоровье",
            region="Global",
            telegram_contact="@aihealth_bot",
            website="https://aihealth.example.com",
            contact_email="contact@aihealth.example.com",
            views_count=1250,
            likes_count=42,
            ai_score=82,
            investment_readiness="high",
            owner_id=users[0].id,
            is_published=True,
            is_approved=True
        ),
        Startup(
            name="Eco Delivery Platform",
            description="Платформа доставки с использованием электромобилей и дронов",
            short_description="Экологичная доставка для городов",
            stage="mvp",
            category="EcoTech",
            team_size=5,
            project_cost=120000,
            monthly_expenses=8000,
            investment_asked=200000,
            traction_metrics={"users": 500, "orders": 1200, "revenue": 18000},
            traction_score=65,
            market_size="500M",
            target_audience="Жители крупных городов",
            region="СНГ",
            telegram_contact="@ecodelivery",
            views_count=850,
            likes_count=28,
            ai_score=71,
            investment_readiness="medium",
            owner_id=users[0].id,
            is_published=True,
            is_approved=True
        )
    ]
    
    for startup in startups:
        db.add(startup)
    db.commit()
    
    print("✅ Тестовые данные созданы")


# Экспорт схемы для Alembic миграций
if __name__ == "__main__":
    init_db()
    db = SessionLocal()
    create_test_data(db)
    db.close()