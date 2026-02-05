# 🏥 HealthCare Management System  
**Disease Records, Analysis, Prescriptions & Referral Management System**

## 📌 Project Overview

The **HealthCare Management System** is a web-based application designed for managing medical records, diagnoses, laboratory analyses, prescriptions, and referrals in a primary healthcare institution (Health Center).

The system provides a centralized platform for patients, doctors, laboratory technicians, and administrators, enabling efficient data management, improved communication, and digitalization of healthcare processes.

The application supports role-based access control, ensuring that each user interacts with the system according to their responsibilities and permissions.

---

## 👥 User Roles

The system supports four main user roles:

- **Patient**
- **Doctor**
- **Laboratory Technician**
- **System Administrator**

Each role has specific functionalities and access rights.

---

## ⚙️ Key Features

### 🔐 Authentication and Authorization

- User login system.
- Unique identification of patients using a national identification number (JMBG).
- Role-based access control (RBAC).
- 
<img width="1904" height="924" alt="login" src="https://github.com/user-attachments/assets/c75e02e2-bf63-4ca7-ba64-aef04300162b" />

## 🧑‍⚕️ Patient Features

### 1️⃣ Personal Profile Overview
Patients can view their personal information.

<img width="1904" height="924" alt="karton" src="https://github.com/user-attachments/assets/ffcb2bc5-e3d8-48db-abdc-a6e1d05f24ef" />

### 2️⃣ Medical Record Overview
Patients can access their digital medical records, including:

- Medical history
- Diagnoses
- Laboratory results
- Prescriptions
- Referrals

<img width="1920" height="911" alt="nalazi" src="https://github.com/user-attachments/assets/01c3af53-975d-43d4-948c-a04e4637f33a" />
<img width="1920" height="919" alt="pregledi" src="https://github.com/user-attachments/assets/4eedeba1-fc1b-4a4f-b8a3-947ebd2b0615" />



### 3️⃣ Medical History and Document Management
Patients can:

- View history of medical examinations and diseases.
- Download laboratory reports, prescriptions, and referrals in PDF format.
  
<img width="1920" height="916" alt="recepti" src="https://github.com/user-attachments/assets/943773ac-9268-4dd0-ad82-1dc9146a9be3" />
<img width="1920" height="916" alt="receptpdf" src="https://github.com/user-attachments/assets/fc29be2f-1f5a-45c7-ace8-9f74357bc01c" />


### 4️⃣ Appointment Requests
Patients can send requests for medical examinations and schedule appointments.

<img width="1920" height="924" alt="zahtjevzapregled" src="https://github.com/user-attachments/assets/1df0abf4-e332-4f70-bd2e-7e02e7c8720e" />

## 👨‍⚕️ Doctor Features

### 1️⃣ Doctor Login
Doctors can securely access the system.

<img width="1920" height="919" alt="doktor-nalog" src="https://github.com/user-attachments/assets/5090fc36-38ea-4ae8-8422-28cef12596bb" />

### 2️⃣ Patient Data Access
Doctors can:

- View patient medical records.
- Add new data to patient records.

### 3️⃣ Data Filtering and Search
Doctors can filter patient data using various criteria.

<img width="1898" height="855" alt="svipacijenti" src="https://github.com/user-attachments/assets/78ef3453-1dbb-483d-b9fb-f19a66162994" />

### 4️⃣ Laboratory Analysis Requests
Doctors can send requests for laboratory analyses for specific patients.

<img width="1920" height="856" alt="zahtjevzaanalizu" src="https://github.com/user-attachments/assets/2361e4a9-7d3e-4202-88d0-7bf206a54581" />

### 5️⃣ Review of Laboratory Results
Doctors can review laboratory findings.

### 6️⃣ Diagnosis Entry
Doctors can enter diagnoses into the system.

### 7️⃣ Prescription Management
Doctors can create and manage prescriptions.

<img width="1920" height="916" alt="recepti" src="https://github.com/user-attachments/assets/aec6e0ea-ded4-4ee2-b13d-09c8c0b6322b" />

### 8️⃣ Referral Management
Doctors can issue referrals to specialists.

<img width="1920" height="916" alt="novauputnica" src="https://github.com/user-attachments/assets/dbb4482c-acc2-4fe2-a509-219017e3802b" />


## 🧪 Laboratory Technician Features

### 1️⃣ Technician Login
Technicians can log into the system.

### 2️⃣ Analysis Request Review
Technicians can view laboratory analysis requests.

### 3️⃣ Analysis Status Management
Technicians can update analysis status:

- In Progress
- Completed
- Rejected (if sample cannot be processed)

### 4️⃣ Laboratory Results Entry
Technicians can enter laboratory test results.

### 5️⃣ PDF Report Generation
Technicians can download laboratory reports in PDF format.

## 🛠️ System Administrator Features

### 1️⃣ User Account Management

In this system, all user accounts are created and managed exclusively by the System Administrator.

- Patients, doctors, and laboratory technicians cannot self-register.
- The System Administrator is responsible for creating, updating, and deleting user accounts.
- Each user receives login credentials directly from the administrator.
- Duplicate accounts are prevented through unique identification of users.
- Role-based access control ensures that each user can access only the functionalities related to their role.

This approach reflects real-world healthcare information systems, where access to medical data must be strictly controlled and managed by authorized personnel to ensure security, privacy, and data integrity.

<img width="1920" height="924" alt="dodajpacijenta" src="https://github.com/user-attachments/assets/99c84d83-9875-42bc-9457-a7f7334e307d" />

## 🚀 Technologies Used

- **Frontend:** React 18.2.0, TypeScript, JavaScript, HTML, CSS
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI)
- **Backend:** ASP.NET Core 9.0 (C#)
- **Database:** SQLite (demo version)
- **API:** RESTful Web API
- **Authentication:** JWT (JSON Web Tokens)
- **Architecture Pattern:** MVC

## 📥 Installation and Setup

### Backend Setup
```bash
git clone https://github.com/elez-n/Dom-zdravlja
cd API
dotnet restore
dotnet run
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## Authors
- **Natasa Elez** – [GitHub](https://github.com/elez-n) 
- **Nikolina Sarac** – [GitHub](https://github.com/nikolinaasarac) 


