import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TalentScore {
    score: bigint;
    insight: string;
    category: TalentCategory;
}
export interface SocialProfile {
    contentTypes: Array<ContentType>;
    interests: Array<string>;
    name: string;
    platform: SocialPlatform;
    topics: Array<string>;
    engagementStyle: EngagementStyle;
    postingFrequency: PostingFrequency;
}
export interface UserProfile {
    name: string;
}
export interface AnalysisResult {
    id: bigint;
    labelText?: string;
    topCategories: Array<TalentCategory>;
    timestamp: bigint;
    talentScores: Array<TalentScore>;
    profile: SocialProfile;
}
export enum ContentType {
    video = "video",
    text = "text",
    links = "links",
    images = "images"
}
export enum EngagementStyle {
    creator = "creator",
    commenter = "commenter",
    sharer = "sharer",
    lurker = "lurker"
}
export enum PostingFrequency {
    monthly = "monthly",
    rarely = "rarely",
    daily = "daily",
    weekly = "weekly"
}
export enum SocialPlatform {
    linkedin = "linkedin",
    tiktok = "tiktok",
    twitter = "twitter",
    instagram = "instagram",
    facebook = "facebook",
    youtube = "youtube",
    reddit = "reddit"
}
export enum TalentCategory {
    communication = "communication",
    strategic = "strategic",
    analytical = "analytical",
    creative = "creative",
    technical = "technical",
    leadership = "leadership",
    entrepreneurial = "entrepreneurial",
    empathetic = "empathetic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSeeds(): Promise<void>;
    deleteAnalysis(id: bigint): Promise<void>;
    getAnalysis(id: bigint): Promise<AnalysisResult>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTalentCategoryOrder(category: TalentCategory): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAnalyses(): Promise<Array<AnalysisResult>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAnalysis(profile: SocialProfile, labelText: string | null): Promise<AnalysisResult>;
}
