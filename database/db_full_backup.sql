--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    student_id integer NOT NULL,
    class_id integer NOT NULL,
    date date NOT NULL,
    status character varying(20) NOT NULL,
    notes text,
    recorded_by integer,
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attendance_records OWNER TO postgres;

--
-- Name: COLUMN attendance_records.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.attendance_records.status IS 'present|absent|late|excused';


--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_records_id_seq OWNER TO postgres;

--
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    teacher character varying(100) NOT NULL,
    subject character varying(10) NOT NULL,
    room character varying(10) NOT NULL,
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: COLUMN classes.subject; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.classes.subject IS 'math|physic|chemistry|other';


--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_id_seq OWNER TO postgres;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: financial_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_accounts (
    id bigint NOT NULL,
    student_id bigint NOT NULL,
    current_balance numeric(38,2) DEFAULT 0 NOT NULL,
    credit_limit numeric(38,2) DEFAULT 0,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financial_accounts OWNER TO postgres;

--
-- Name: financial_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financial_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_accounts_id_seq OWNER TO postgres;

--
-- Name: financial_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financial_accounts_id_seq OWNED BY public.financial_accounts.id;


--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id integer NOT NULL,
    invoice_id integer NOT NULL,
    class_id integer NOT NULL,
    description character varying(255),
    amount numeric(12,2) NOT NULL,
    quantity integer DEFAULT 1,
    subtotal numeric(12,2) NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_items_id_seq OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_items_id_seq OWNED BY public.invoice_items.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    student_id integer NOT NULL,
    invoice_number character varying(20) NOT NULL,
    issue_date date NOT NULL,
    due_date date NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    paid_amount numeric(12,2) DEFAULT 0,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: COLUMN invoices.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.invoices.status IS 'pending|partial|paid|overdue|cancelled';


--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    phone character varying(20) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    notification_type character varying(20),
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    is_rep boolean DEFAULT false,
    rep_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: COLUMN notifications.notification_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notifications.notification_type IS 'payment|attendance|system';


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    facebook_link text,
    full_name character varying(255) NOT NULL,
    grade character varying(10) NOT NULL,
    note text,
    parent_phone character varying(20),
    school character varying(255) NOT NULL,
    student_phone character varying(20),
    subject character varying(50) NOT NULL
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.registrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.registrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule (
    class_id bigint NOT NULL,
    weekday character varying(3) NOT NULL,
    time_start time without time zone NOT NULL,
    time_end time without time zone NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.schedule OWNER TO postgres;

--
-- Name: COLUMN schedule.weekday; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.schedule.weekday IS 'mon|tue|wed|thu|fri|sat|sun';


--
-- Name: schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_id_seq OWNER TO postgres;

--
-- Name: schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_id_seq OWNED BY public.schedule.id;


--
-- Name: student_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_classes (
    student_id bigint NOT NULL,
    class_id bigint NOT NULL,
    enrollment_date date DEFAULT CURRENT_DATE,
    status character varying(20) DEFAULT 'active'::character varying,
    id bigint NOT NULL
);


ALTER TABLE public.student_classes OWNER TO postgres;

--
-- Name: COLUMN student_classes.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.student_classes.status IS 'active|inactive|dropped';


--
-- Name: student_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_classes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_classes_id_seq OWNER TO postgres;

--
-- Name: student_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_classes_id_seq OWNED BY public.student_classes.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10) NOT NULL,
    school character varying(255) NOT NULL,
    grade character varying(10) NOT NULL,
    phone_student character varying(20),
    phone_parent character varying(20),
    facebook_link character varying(255),
    note character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: COLUMN students.grade; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.students.grade IS 'khá»‘i lá»›p 6 - 12';


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    account_id integer NOT NULL,
    invoice_id integer,
    amount numeric(12,2) NOT NULL,
    transaction_type character varying(20) NOT NULL,
    payment_method character varying(20),
    reference_number character varying(50),
    description text,
    receipt_image character varying(255),
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: COLUMN transactions.transaction_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.transactions.transaction_type IS 'payment|tuition|refund|adjustment|discount';


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: tuition_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tuition_plans (
    id integer NOT NULL,
    class_id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    effective_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tuition_plans OWNER TO postgres;

--
-- Name: tuition_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tuition_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tuition_plans_id_seq OWNER TO postgres;

--
-- Name: tuition_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tuition_plans_id_seq OWNED BY public.tuition_plans.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100),
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.role IS 'admin|teacher|staff';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: financial_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_accounts ALTER COLUMN id SET DEFAULT nextval('public.financial_accounts_id_seq'::regclass);


--
-- Name: invoice_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_items_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: schedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule ALTER COLUMN id SET DEFAULT nextval('public.schedule_id_seq'::regclass);


--
-- Name: student_classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes ALTER COLUMN id SET DEFAULT nextval('public.student_classes_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: tuition_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tuition_plans ALTER COLUMN id SET DEFAULT nextval('public.tuition_plans_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_records (id, student_id, class_id, date, status, notes, recorded_by, recorded_at) FROM stdin;
1	1	1	2023-10-02	present	\N	2	2025-04-03 15:30:09.922609
2	1	2	2023-10-03	present	\N	3	2025-04-03 15:30:09.922609
3	2	1	2023-10-02	absent	\N	2	2025-04-03 15:30:09.922609
4	3	3	2023-10-06	late	\N	3	2025-04-03 15:30:09.922609
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, name, teacher, subject, room, start_date, end_date, created_at) FROM stdin;
1	Toan 10 NC	Nguyen Thi D	math	P101	2023-09-01	2024-05-30	2025-04-03 15:30:09.877683
2	Ly 11 CB	Tran Van E	physic	P102	2023-09-01	2024-05-30	2025-04-03 15:30:09.877683
3	Hoa 12	Le Thi F	chemistry	P103	2023-09-01	2024-05-30	2025-04-03 15:30:09.877683
\.


--
-- Data for Name: financial_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financial_accounts (id, student_id, current_balance, credit_limit, last_updated) FROM stdin;
1	1	2000000.00	0.00	2025-04-03 15:30:09.879277
2	2	1500000.00	0.00	2025-04-03 15:30:09.879277
3	3	0.00	0.00	2025-04-03 15:30:09.879277
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, class_id, description, amount, quantity, subtotal) FROM stdin;
1	1	1	\N	500000.00	1	500000.00
2	1	2	\N	600000.00	1	600000.00
3	2	1	\N	500000.00	1	500000.00
4	3	3	\N	700000.00	1	700000.00
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, student_id, invoice_number, issue_date, due_date, total_amount, paid_amount, status, notes, created_at) FROM stdin;
1	1	INV-202310-001	2023-10-01	2023-10-10	1100000.00	1100000.00	paid	\N	2025-04-03 15:30:09.911167
2	2	INV-202310-002	2023-10-01	2023-10-10	500000.00	300000.00	partial	\N	2025-04-03 15:30:09.911167
3	3	INV-202310-003	2023-10-01	2023-10-10	700000.00	0.00	pending	\N	2025-04-03 15:30:09.911167
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, phone, title, content, notification_type, is_read, read_at, is_rep, rep_at, created_at) FROM stdin;
1	0987654321	Thong bao hoc phi	Vui long thanh toan hoc phi thang 10	payment	f	\N	f	\N	2025-04-03 15:30:09.934254
2	0912345679	Thong bao nghi hoc	Ngay mai lop nghi do co giao ban	attendance	f	\N	f	\N	2025-04-03 15:30:09.934254
3	0987654322	Thong bao he thong	He thong se bao tri vao 20/10	system	f	\N	f	\N	2025-04-03 15:30:09.934254
\.


--
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrations (id, created_at, facebook_link, full_name, grade, note, parent_phone, school, student_phone, subject) FROM stdin;
1	2025-03-25 00:02:55.606	https://facebook.com/nguyenvana	Nguyễn Văn A	10	Muốn học nâng cao	0987654321	THPT Nguyễn Trãi	0912345678	Toán học
2	2025-03-25 00:06:28.538	https://facebook.com/nguyenvana	Bechovang	10	Học yếu	0987654321	THPT Nguyễn Trãi	0912345678	Toán học
3	2025-03-25 00:06:39.093	https://facebook.com/nguyenvana	bechocam	10	Học yếu	0987654321	THPT Nguyễn Trãi	0912345678	Toán học
4	2025-03-25 00:06:57.864	https://facebook.com/nguyenvana	betho	10	Đang FA <3	0987654321	THPT Nguyễn Trãi	0912345678	Toán học
5	2025-03-25 00:15:37.668	https://facebook.com/nguyenvana	bethotrangcute	10	Đang FA <3	0987654321	THPT Nguyễn Trãi	0912345678	Toán học
6	2025-03-25 00:52:33.02		Nguyễn Ngọc Phúc	11	hi ae	31231231	fpt	1233	Toán
7	2025-03-25 01:51:46.9		ZZaaa	12		131312	adsadsa	132131	Hóa
8	2025-03-25 01:59:58.404		werrwwe	12		3423234	fdsfs	32334	Hóa
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule (class_id, weekday, time_start, time_end, id) FROM stdin;
1	mon	08:00:00	10:00:00	1
1	wed	08:00:00	10:00:00	2
2	tue	13:00:00	15:00:00	3
2	thu	13:00:00	15:00:00	4
3	fri	15:00:00	17:00:00	5
\.


--
-- Data for Name: student_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_classes (student_id, class_id, enrollment_date, status, id) FROM stdin;
1	1	2025-04-03	active	1
1	2	2025-04-03	active	2
2	1	2025-04-03	active	3
3	3	2025-04-03	active	4
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, date_of_birth, gender, school, grade, phone_student, phone_parent, facebook_link, note, created_at) FROM stdin;
1	Nguyen Van A	2005-03-15	male	THPT ABC	10	0912345678	0987654321	facebook.com/nguyenvana	Hoc sinh cham chi	2025-04-03 15:30:09.875518
2	Tran Thi B	2006-05-20	female	THPT XYZ	9	0912345679	0987654322	facebook.com/tranthib	Can ho tro toan	2025-04-03 15:30:09.875518
3	Le Van C	2004-01-10	male	THPT DEF	11	0912345680	0987654323	facebook.com/levanc	Hoc sinh moi	2025-04-03 15:30:09.875518
4	Bechovang	2005-03-15	male	THPT ABC	10	0912345678	0987654321	facebook.com/nguyenvana	Hoc sinh cham chi	2025-04-07 15:13:37.344362
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, account_id, invoice_id, amount, transaction_type, payment_method, reference_number, description, receipt_image, created_by, created_at) FROM stdin;
1	1	1	-1100000.00	tuition	\N	\N	\N	\N	1	2025-04-03 15:30:09.919648
2	1	1	1100000.00	payment	bank	\N	\N	\N	4	2025-04-03 15:30:09.919648
3	2	2	-500000.00	tuition	\N	\N	\N	\N	1	2025-04-03 15:30:09.919648
4	2	2	300000.00	payment	cash	\N	\N	\N	4	2025-04-03 15:30:09.919648
5	3	3	-700000.00	tuition	\N	\N	\N	\N	1	2025-04-03 15:30:09.919648
\.


--
-- Data for Name: tuition_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tuition_plans (id, class_id, amount, effective_date, created_at) FROM stdin;
1	1	500000.00	2023-09-01	2025-04-03 15:30:09.882932
2	2	600000.00	2023-09-01	2025-04-03 15:30:09.882932
3	3	700000.00	2023-09-01	2025-04-03 15:30:09.882932
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, email, role, created_at) FROM stdin;
2	teacher1	$2a$10$eybTDCEisl9jqmrnpGjd2e8YO3XT6BoFeAy/U13eP2w71WrlFmNM2	teacher1@school.com	teacher	2025-04-03 15:30:09.780742
3	teacher2	$2a$10$1dfcmYw84lNlE2vsZuJnouLQrklfGXQmwhsTj4rpbxIf3uLwzen5e	teacher2@school.com	teacher	2025-04-03 15:30:09.780742
4	staff1	$2a$10$otbUq.uP6vNtsZ/wb5Q49.h/9Vs9PxosRXRp/F3yRCpDA6HN4jL8O	staff1@school.com	staff	2025-04-03 15:30:09.780742
1	admin	$2a$10$90XNgon5aL1mQcWrevu9B.HU7WFyPGsDCFZDuqeDHjdaUWTodBoei	admin@school.com	admin	2025-04-03 15:30:09.780742
\.


--
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 4, true);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_id_seq', 3, true);


--
-- Name: financial_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.financial_accounts_id_seq', 3, true);


--
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 4, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 3, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 3, true);


--
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 8, true);


--
-- Name: schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_id_seq', 5, true);


--
-- Name: student_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_classes_id_seq', 4, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 4, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 5, true);


--
-- Name: tuition_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tuition_plans_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: financial_accounts financial_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_pkey PRIMARY KEY (id);


--
-- Name: financial_accounts financial_accounts_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_student_id_key UNIQUE (student_id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: student_classes student_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_pkey PRIMARY KEY (student_id, class_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: tuition_plans tuition_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tuition_plans
    ADD CONSTRAINT tuition_plans_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: attendance_records attendance_records_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: attendance_records attendance_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: financial_accounts financial_accounts_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: schedule schedule_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: student_classes student_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: student_classes student_classes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- Name: tuition_plans tuition_plans_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tuition_plans
    ADD CONSTRAINT tuition_plans_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

