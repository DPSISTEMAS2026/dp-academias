export type Belt = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK' | 'GRAY';
export type UserRole = 'guest' | 'admin' | 'superadmin' | 'student';
export type ViewMode = 'landing' | 'auth' | 'app';

export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    targetAudience: 'ADULTS' | 'KIDS' | 'BOTH';
    category: string;
    format?: 'video' | 'document';
    discipline?: string;
    belts?: Belt[];
    authorizedOnly?: boolean;
    duration?: string;
    beltLevel?: string;
}

export interface PaymentRecord {
    date: string;
    status: 'Completado' | 'Pendiente';
    amount: number;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthDate?: string;
    documentId?: string;
    belt: Belt;
    classesAttended: number;
    classesToNextBelt: number;
    lastPaymentMonth: string;
    isPaid: boolean;
    history: PaymentRecord[];
    tutorName?: string;
    tutorEmail?: string;
    tutorPhone?: string;
    plan?: string;
    monthlyFee?: number;
    joinDate?: string;
    lastGrade?: string;
    graduationDate?: string;
    evaluationDate?: string;
    lastPaymentDate?: string;
    avatar?: string;
    password?: string;
    allergies?: string;
    discipline?: string;
    emergencyName?: string;
    emergencyPhone?: string;
    emergencyRelation?: string;
    tutorRelation?: string;
    scheduledClasses?: {
        day: string;
        time: string;
        name: string;
        timestamp: number;
    }[];
    weight?: number;
    gender?: 'MALE' | 'FEMALE';
    terms_accepted?: boolean;
    sedeId?: number;
    sede_id?: number;
    progress?: StudentProgress;
}

export interface GradeEvent {
    id: string;
    label: string;
    belt: Belt;
    stripes: number;
    date: string;
    notes?: string;
}

export interface StudentProgress {
    stripes: number;
    techniquesDone: number;
    techniquesTotal: number;
    evaluation: number;
    evaluationDate?: string;
    notes: string;
    history: GradeEvent[];
}

export type PlanFees = {
    adults: { [classesPerWeek: string]: number };
    kids: { [classesPerWeek: string]: number };
};

export interface AutomationConfig {
    reminderDay: number;
    reminderEnabled?: boolean;
    mercadoPago?: boolean;
    transfer?: boolean;
    whatsappTemplate: string;
    emailTemplate: string;
}

export type ClassAudience = 'ADULTS' | 'KIDS' | 'BOTH';

export interface ClassSlot {
    id: string;
    name: string;
    day: string;
    startTime: string;
    endTime: string;
    teacher: string;
    sedeId: number;
    audience: ClassAudience;
    sortOrder: number;
    /** null = sin límite de cupos */
    capacity: number | null;
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    slotId: string;
    date: string;
    checkedAt: string;
    withinWindow: boolean;
}

export type EventStatus = 'draft' | 'published';
export type EventGender = 'ANY' | 'MALE' | 'FEMALE';
export type RegistrationKind = 'student' | 'guest';
export type RegistrationStatus = 'pending' | 'paid';

export interface EventCategory {
    id: string;
    name: string;
    minAge: number | null;
    maxAge: number | null;
    minWeight: number | null;
    maxWeight: number | null;
    gender: EventGender;
    belts: Belt[];
    price: number;
}

export interface AcademyEvent {
    id: string;
    slug: string;
    title: string;
    description: string;
    photo: string;
    rulesUrl: string;
    rulesName: string;
    date: string;
    startTime: string;
    endTime: string;
    address: string;
    capacity: number | null;
    paid: boolean;
    price: number;
    status: EventStatus;
    categories: EventCategory[];
    createdAt?: string;
    registered?: number;
}

export interface EventRegistration {
    id: string;
    eventId: string;
    kind: RegistrationKind;
    studentId?: string | null;
    name: string;
    email: string;
    phone: string;
    documentId?: string;
    birthDate?: string;
    age: number | null;
    weight: number | null;
    gender?: string;
    belt?: Belt | string;
    academy?: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    status: RegistrationStatus;
    method?: string;
    createdAt?: string;
}
