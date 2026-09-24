export type UserRole = "patient" | "provider" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PatientProfileFields {
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodType: string;
  allergies: string;
  preferredPharmacy: string;
}

export interface ProviderProfileFields {
  specialty: string;
  licenseNumber: string;
  department: string;
  bio: string;
  acceptingNewPatients: boolean;
}

export interface AdminProfileFields {
  department: string;
  jobTitle: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  address: UserAddress;
  avatarUrl?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  labResultAlerts: boolean;
  patient?: PatientProfileFields;
  provider?: ProviderProfileFields;
  admin?: AdminProfileFields;
}

export type SeverityFlag = "normal" | "borderline" | "critical";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  nextAvailable: string;
  availability: "today" | "soon" | "unavailable";
  image?: string;
  bio?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  location: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  flag: SeverityFlag;
  date: string;
  history: { date: string; value: number }[];
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  refillsRemaining: number;
  nextRefillDate: string;
  pharmacy: string;
}

export type RefillRequestStatus =
  | "submitted"
  | "sent_to_pharmacy"
  | "processing"
  | "ready_for_pickup"
  | "renewal_pending"
  | "renewal_approved";

export type RefillRequestType = "refill" | "renewal";
export type RefillPickupMethod = "pickup" | "mail";

export interface RefillRequest {
  id: string;
  prescriptionId: string;
  medicationName: string;
  dosage: string;
  pharmacy: string;
  status: RefillRequestStatus;
  type: RefillRequestType;
  pickupMethod: RefillPickupMethod;
  requestedAt: string;
  estimatedReadyAt: string;
  refillsAfter?: number;
  completedAt?: string;
}

export interface MessageThread {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  sentAt: string;
  readAt?: string;
  isPatient: boolean;
}

export interface Notification {
  id: string;
  type: "appointment" | "result" | "prescription" | "message";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
}

export interface InsurancePlan {
  planName: string;
  memberId: string;
  groupNumber: string;
  deductible: number;
  deductibleMet: number;
  copayPrimary: number;
  copaySpecialist: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string;
  lastVisit: string;
  conditions: string[];
  status: "active" | "inactive";
  nextAppointment?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activePatients: number;
  activeProviders: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  labResultsPending: number;
  messagesUnread: number;
  systemUptimePercent: number;
  avgResponseTimeMs: number;
  storageUsedGb: number;
  storageTotalGb: number;
}

export type BookingStep = "specialty" | "doctor" | "datetime" | "confirm";

export interface NotificationGroup {
  type: Notification["type"];
  label: string;
  notifications: Notification[];
}
