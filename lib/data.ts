export type Student = {
  id: string;
  name: string;
  className: string;
  graduationYear: number;
  counselor: string;
  country: string;
  targetUniversity: string;
  major: string;
  stage: string;
  risk: "Cao" | "Trung bình" | "Thấp";
  progress: number;
  gpa: number;
  ielts: number;
  sat: number;
  deadline: string;
  missing: number;
  newFiles: number;
};

const names = [
  "Nguyễn Minh Anh",
  "Trần Gia Hân",
  "Lê Hoàng Nam",
  "Phạm Khánh Linh",
  "Đỗ Đức Minh",
  "Vũ Ngọc Mai",
  "Bùi Anh Khoa",
  "Hoàng Thảo Vy",
  "Ngô Quang Huy",
  "Dương Hà My",
  "Đinh Tuấn Kiệt",
  "Lý Bảo Trâm",
  "Nguyễn Nhật Minh",
  "Trần Phương Anh",
  "Lê Gia Bảo",
  "Phạm Minh Châu",
  "Đỗ Hải Đăng",
  "Vũ Thanh Hà",
  "Bùi Quốc Anh",
  "Hoàng Mai Chi",
  "Ngô Minh Đức",
  "Dương Khánh An",
  "Đinh Ngọc Bảo",
  "Lý Tuệ Nhi",
  "Nguyễn Thành Công",
  "Trần Thùy Dương",
  "Lê Anh Quân",
  "Phạm Mỹ Linh",
  "Đỗ Trọng Nhân",
  "Vũ Hoàng Yến",
  "Bùi Minh Triết",
  "Hoàng An Nhiên",
  "Ngô Đức Anh",
  "Dương Bảo Ngọc",
  "Đinh Minh Khôi",
  "Lý Phương Thảo",
];

const targets = [
  ["Hoa Kỳ", "Boston University", "Khoa học dữ liệu"],
  ["Anh", "University of Manchester", "Kinh doanh quốc tế"],
  ["Canada", "University of Toronto", "Tâm lý học"],
  ["Úc", "University of Melbourne", "Truyền thông"],
  ["Singapore", "NUS", "Khoa học máy tính"],
  ["Hà Lan", "Erasmus University", "Kinh tế học"],
  ["Hàn Quốc", "Yonsei University", "Thiết kế"],
  ["Nhật Bản", "Waseda University", "Quan hệ quốc tế"],
];

const stages = [
  "Tư vấn lần 1",
  "Có University List",
  "Chuẩn bị hồ sơ",
  "Sẵn sàng nộp",
  "Đã nộp",
  "Có kết quả",
];
const counselors = [
  "Nguyễn Hà Linh",
  "Trần Đức Anh",
  "Lê Thu Trang",
  "Phạm Hoàng Long",
];

export const students: Student[] = names.map((name, index) => {
  const target = targets[index % targets.length];
  return {
    id: `NSHM${String(260101 + index).padStart(6, "0")}`,
    name,
    className: `${10 + (index % 3)}A${1 + (index % 6)}`,
    graduationYear: 2027 + (index % 3),
    counselor: counselors[index % counselors.length],
    country: target[0],
    targetUniversity: target[1],
    major: target[2],
    stage: stages[index % stages.length],
    risk: index % 9 === 0 ? "Cao" : index % 4 === 0 ? "Trung bình" : "Thấp",
    progress: 35 + ((index * 7) % 63),
    gpa: Number((8.1 + ((index * 13) % 17) / 10).toFixed(1)),
    ielts: Number((6 + (index % 5) * 0.5).toFixed(1)),
    sat: 1220 + (index % 8) * 50,
    deadline: `${String(4 + (index % 24)).padStart(2, "0")}/07/2026`,
    missing: index % 6,
    newFiles: index % 4,
  };
});

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Tin tức" | "Học bổng" | "Tuyển sinh" | "Câu chuyện" | "Chuyến đi";
  date: string;
  readTime: string;
  accent: string;
  published: boolean;
};

const postSeed = [
  [
    "Cánh cửa toàn cầu bắt đầu từ một cuộc trò chuyện",
    "Tuần lễ tư vấn 1:1 giúp học sinh nhận diện lộ trình phù hợp với năng lực và ước mơ.",
    "Tin tức",
  ],
  [
    "Học bổng Future Leaders 2027 tại Canada",
    "Cơ hội học bổng đến 50% dành cho học sinh có thành tích học thuật và hoạt động cộng đồng nổi bật.",
    "Học bổng",
  ],
  [
    "University of Melbourne: cập nhật kỳ tuyển sinh 2027",
    "Tổng hợp yêu cầu đầu vào, mốc nộp hồ sơ và lưu ý dành cho học sinh Việt Nam.",
    "Tuyển sinh",
  ],
  [
    "Từ NSHM đến Boston: hành trình của Minh Khang",
    "Một câu chuyện về sự bền bỉ, tư duy khám phá và bộ hồ sơ mang đậm dấu ấn cá nhân.",
    "Câu chuyện",
  ],
  [
    "Study Tour Singapore: học qua trải nghiệm",
    "Học sinh khám phá NUS, doanh nghiệp công nghệ và môi trường học tập quốc tế.",
    "Chuyến đi",
  ],
  [
    "Workshop viết Personal Statement cùng chuyên gia",
    "Biến trải nghiệm thật thành một bài luận rõ tiếng nói, có chiều sâu và đáng nhớ.",
    "Tin tức",
  ],
  [
    "Học bổng Orange Tulip Scholarship 2027",
    "Thông tin mới nhất về điều kiện, ngành học và chiến lược chuẩn bị hồ sơ Hà Lan.",
    "Học bổng",
  ],
  [
    "NUS mở chương trình Data Science mới",
    "Điểm nổi bật của chương trình liên ngành và các tiêu chí tuyển sinh cần lưu ý.",
    "Tuyển sinh",
  ],
  [
    "Mai Anh và dự án xanh chạm tới cộng đồng",
    "Từ một ý tưởng trong CLB đến minh chứng leadership thuyết phục trong hồ sơ du học.",
    "Câu chuyện",
  ],
  [
    "Nhật ký Seoul: văn hóa, sáng tạo và đại học",
    "Bảy ngày học tập qua thành phố, phòng lab và những cuộc gặp sinh viên quốc tế.",
    "Chuyến đi",
  ],
  [
    "Ngày hội Đại học Quốc tế NSHM 2026",
    "Gặp gỡ đại diện 25 trường đại học và đặt câu hỏi trực tiếp về ngành học, học bổng.",
    "Tin tức",
  ],
  [
    "Học bổng Global Excellence tại Anh",
    "Checklist 6 bước để hoàn thiện hồ sơ học bổng trước thời hạn ưu tiên.",
    "Học bổng",
  ],
  [
    "Waseda: lộ trình chương trình giảng dạy bằng tiếng Anh",
    "Các ngành nổi bật, yêu cầu EJU/SAT và kinh nghiệm chuẩn bị phỏng vấn.",
    "Tuyển sinh",
  ],
  [
    "Hải Đăng: chọn đúng ngành trước khi chọn trường",
    "Cách một học sinh lớp 12 dùng dự án và trải nghiệm nghề nghiệp để tìm ra hướng đi.",
    "Câu chuyện",
  ],
  [
    "Khám phá Sydney qua lăng kính học thuật",
    "Một hành trình kết nối lớp học, môi trường đô thị và định hướng nghề nghiệp tương lai.",
    "Chuyến đi",
  ],
  [
    "Mùa hồ sơ 2027 chính thức khởi động",
    "Các mốc quan trọng và việc học sinh lớp 11, 12 nên hoàn thành trong tháng này.",
    "Tin tức",
  ],
  [
    "Monash International Merit Scholarship",
    "Hướng dẫn điều kiện, thời hạn và cách làm nổi bật thành tích học tập.",
    "Học bổng",
  ],
  [
    "Toronto cập nhật yêu cầu IELTS và hồ sơ bổ sung",
    "Thông tin theo từng khoa dành cho học sinh chuẩn bị ứng tuyển Canada.",
    "Tuyển sinh",
  ],
] as const;

const accents = ["#8f1d2c", "#b58a32", "#173b65", "#5e294d", "#23606a"];
export const posts: Post[] = postSeed.map((item, i) => ({
  slug: `bai-viet-${i + 1}-${item[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`,
  title: item[0],
  excerpt: item[1],
  category: item[2],
  date: `${String(28 - (i % 20)).padStart(2, "0")}/06/2026`,
  readTime: `${4 + (i % 5)} phút đọc`,
  accent: accents[i % accents.length],
  published: i !== 15,
}));

export const evidenceItems = [
  {
    title: "IELTS Academic",
    kind: "Chứng chỉ",
    detail: "Overall 7.5 · L 8.0 · R 8.0 · W 7.0 · S 7.0",
    level: "A",
    status: "Đã xác thực",
    date: "12/05/2026",
  },
  {
    title: "SAT Digital",
    kind: "Chứng chỉ",
    detail: "1450 · Math 760 · Reading & Writing 690",
    level: "A",
    status: "Đã xác thực",
    date: "08/03/2026",
  },
  {
    title: "Chủ nhiệm CLB Debate",
    kind: "CLB & Leadership",
    detail: "Điều phối 28 thành viên, tổ chức 4 giải tranh biện",
    level: "B",
    status: "Đã duyệt",
    date: "20/04/2026",
  },
  {
    title: "Dự án Green Steps",
    kind: "Hoạt động cộng đồng",
    detail: "Đồng sáng lập · 420 học sinh tham gia · giảm 1.2 tấn nhựa",
    level: "A",
    status: "Đã xác thực",
    date: "16/04/2026",
  },
  {
    title: "Giải Nhì Tin học Thành phố",
    kind: "Giải thưởng",
    detail: "Bảng chuyên THPT · Năm học 2025-2026",
    level: "A",
    status: "Đã xác thực",
    date: "02/02/2026",
  },
  {
    title: "MUN Singapore 2026",
    kind: "Sự kiện quốc tế",
    detail: "Outstanding Delegate · WHO Committee",
    level: "C",
    status: "Cần bổ sung",
    date: "17/01/2026",
  },
];

export const applications = [
  {
    university: "Boston University",
    country: "Hoa Kỳ",
    type: "Reach",
    round: "Early Decision",
    deadline: "01/11/2026",
    status: "Chuẩn bị hồ sơ",
    fit: 88,
    scholarship: "Merit Scholarship",
    owner: "Nguyễn Hà Linh",
  },
  {
    university: "Northeastern University",
    country: "Hoa Kỳ",
    type: "Reach",
    round: "Early Action",
    deadline: "01/11/2026",
    status: "Sẵn sàng nộp",
    fit: 84,
    scholarship: "Đang đánh giá",
    owner: "Nguyễn Hà Linh",
  },
  {
    university: "University of Wisconsin-Madison",
    country: "Hoa Kỳ",
    type: "Target",
    round: "Early Action",
    deadline: "01/11/2026",
    status: "Chuẩn bị hồ sơ",
    fit: 91,
    scholarship: "Không",
    owner: "Nguyễn Hà Linh",
  },
  {
    university: "Penn State University",
    country: "Hoa Kỳ",
    type: "Target",
    round: "Rolling",
    deadline: "01/12/2026",
    status: "Chưa bắt đầu",
    fit: 86,
    scholarship: "Đang đánh giá",
    owner: "Nguyễn Hà Linh",
  },
  {
    university: "Arizona State University",
    country: "Hoa Kỳ",
    type: "Safety",
    round: "Priority",
    deadline: "15/11/2026",
    status: "Đã nộp",
    fit: 93,
    scholarship: "$12,000/năm",
    owner: "Nguyễn Hà Linh",
  },
];

export const documents = [
  {
    name: "Common App Personal Essay",
    category: "Essays",
    university: "Dùng chung",
    version: "v4",
    owner: "Học sinh",
    work: "Cần sửa",
    review: "Cần chỉnh sửa",
    deadline: "18/07/2026",
  },
  {
    name: "Why Boston University?",
    category: "Essays",
    university: "Boston University",
    version: "v2",
    owner: "Học sinh",
    work: "Đang viết",
    review: "Chưa duyệt",
    deadline: "26/07/2026",
  },
  {
    name: "Học bạ lớp 10-11",
    category: "Academic",
    university: "Dùng chung",
    version: "Final",
    owner: "Nhà trường",
    work: "Hoàn thành",
    review: "Đã duyệt",
    deadline: "15/08/2026",
  },
  {
    name: "Thư giới thiệu - GVCN",
    category: "LOR",
    university: "Dùng chung",
    version: "v1",
    owner: "GVCN",
    work: "Đang viết",
    review: "Chờ duyệt",
    deadline: "30/08/2026",
  },
  {
    name: "CSS Profile",
    category: "Financial",
    university: "Boston University",
    version: "-",
    owner: "CMHS",
    work: "Chưa bắt đầu",
    review: "Chưa duyệt",
    deadline: "01/10/2026",
  },
  {
    name: "Activity List",
    category: "Application",
    university: "Dùng chung",
    version: "v3",
    owner: "Học sinh",
    work: "Hoàn thành",
    review: "Đã duyệt",
    deadline: "20/07/2026",
  },
];
