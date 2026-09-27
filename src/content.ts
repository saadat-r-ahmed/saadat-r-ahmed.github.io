// Single source of truth for every fact on the page. Mirrors saadat-r-ahmed.pdf.

export const profile = {
  name: "Saadat Rafid Ahmed",
  role: "Lecturer, Department of Computer Science and Engineering",
  affiliation: "BRAC University",
  location: "Dhaka, Bangladesh",
  emails: ["saadat.r.ahmed@gmail.com", "saadat.ahmed@bracu.ac.bd"],
};

// Empty url = link hidden. Drop in the handle to publish it.
export const links = [
  { label: "Google Scholar", url: "", icon: "scholar" },
  { label: "GitHub", url: "https://github.com/saadat-r-ahmed", icon: "github" },
  { label: "LinkedIn", url: "", icon: "linkedin" },
  {
    label: "Faculty Profile",
    url: "https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed",
    icon: "university",
  },
  { label: "Curriculum Vitae (PDF)", url: "/cv.pdf", icon: "cv" },
];

export const statement = [
  `I work on sequence models, learning under label scarcity, and the reliability of
   transfer-learned representations. My thesis established that multilingual pretraining
   transfers task accuracy far more readily than it transfers robustness: three structured
   perturbation strategies, operating at the character and subword level, degraded
   BERT- and LSTM-based classifiers by 18–40% F1 in a domain where the annotated data
   behind established robustness results does not exist.`,
  `Alongside teaching, I lead an ML team running retrieval and extraction pipelines over
   noisy, mixed-script document collections at national scale, serving more than 155,000
   students. That work is where the failure mode that interests me is most visible: retrieval
   that returns confident, wrong evidence, and accuracy metrics that do not surface it.`,
  `The methods carry over directly to the work I want to do next.
   Biological sequence is another domain where labels are scarce, noise
   is structured rather than random, and model failure is silent — the same conditions that
   make sequence models fragile in low-resource natural language. In the long run, I want
   that work to make an impact in cancer research.`,
];

// Newest first. Add a line here whenever something happens; it is the one section
// a returning visitor checks.
export const news = [
  {
    date: "Aug 2026",
    text: `Completed a consultancy with OneICT, re-architecting the data platform and
      delivering a conversational analytics pipeline for National AgriCare Group.`,
  },
  {
    date: "Nov 2025",
    text: `destroR released as a preprint on arXiv (2511.11309) and submitted to an
      international venue.`,
  },
  {
    date: "May 2024",
    text: `Joined BRAC University as a Lecturer in the Department of Computer Science and
      Engineering.`,
  },
  {
    date: "Dec 2023",
    text: `Graduated with a 4.00 / 4.00 CGPA and the Vice-Chancellor's Award.`,
  },
  {
    date: "2023",
    text: `Ranked Top 12 worldwide out of 80+ teams at SemEval-2023 Task 10, co-located
      with ACL 2023.`,
  },
];

export const interests = {
  current: [
    "Sequence Modeling and Representation Learning",
    "Machine Learning under Label Scarcity",
    "Robustness of Transfer-Learned Models",
    "Open-Source Benchmarks and Tooling",
    "Retrieval over Large Technical Corpora",
    "NLP for Low-Resource Languages",
  ],
  intended: `Bioinformatics and computational genomics — carrying sequence models,
    transfer-learning diagnostics, and benchmark tooling across from low-resource natural
    language to biological sequence.`,
};

export const publications = [
  {
    abbr: "arXiv\n2025",
    authors: "S. R. Ahmed",
    firstAuthor: true,
    title:
      "destroR: Attacking Transfer Models with Obfuscous Examples to Discard Perplexity",
    venue: "arXiv preprint arXiv:2511.11309",
    year: "2025",
    note: "Under review at an international venue. Structured character- and subword-level perturbation of transfer-learned sequence classifiers.",
    url: "https://arxiv.org/abs/2511.11309",
    bibtex: `@article{ahmed2025destror,
  title   = {destroR: Attacking Transfer Models with Obfuscous Examples
             to Discard Perplexity},
  author  = {Ahmed, Saadat Rafid},
  journal = {arXiv preprint arXiv:2511.11309},
  year    = {2025}
}`,
  },
];

export const software = [
  {
    abbr: "Tooling",
    name: "BSenti",
    role: "Sole author",
    desc: `A unified benchmark and toolkit for a low-resource sequence-classification domain.
      Open-source Python library consolidating fragmented, inconsistently formatted datasets
      behind one interface, with reproducible comparative evaluation across statistical
      (SVM, Naive Bayes, Logistic Regression) and deep learning (BiLSTM, BERT) baselines.`,
  },
];

export const sharedTasks = [
  {
    abbr: "SemEval\n2023",
    name: "SemEval-2023 Task 10",
    role: "Competing participant",
    desc: `Co-located with ACL 2023. Hierarchical, fine-grained sequence classification under
      severe class imbalance. Ranked Top 12 worldwide out of 80+ teams, Micro F1 of 53.47%.`,
  },
];

export const research = [
  {
    title: "Thesis Research — Robustness of Transfer-Learned Sequence Classifiers",
    org: "BRAC University",
    meta: "Advisor: Dr. Farig Yousuf Sadeque, Associate Professor",
    period: "2022 – 2023",
    body: `I studied how transfer-learned classifiers behave under small, structured edits to the
      input sequence, in a domain where the annotated data behind established robustness results
      does not exist. I devised three perturbation strategies operating at the character and
      subword level: homoglyph substitution over visually confusable symbols, suffix perturbation
      against agglutinative morphology, and meaning-preserving token replacement. Across BERT- and
      LSTM-based classifiers they cost 18–40% F1. The work is first-authored, released as
      arXiv:2511.11309, and under review at an international venue.`,
  },
  {
    title: "Retrieval and Extraction Pipelines over Noisy Document Collections",
    org: "Innospace Infotech Ltd.",
    meta: "Research strand of the ML Team Lead role",
    period: "Nov. 2024 – Present",
    body: `I designed hierarchical retrieval combining dense embeddings with BM25 reranking over a
      national curriculum corpus, supporting context-grounded multi-turn query answering. To catch
      the silent retrieval failures that accuracy alone does not surface, I built an automated
      validation pipeline that uses multi-hop reasoning to check retrieved evidence against more
      than 170,000 questions. A custom OCR stage handles degraded scanned sources and a T5 pipeline
      handles mixed-script extraction — a noisy-signal-to-discrete-symbol problem where
      off-the-shelf pipelines fail.`,
  },
  {
    title: "Thesis Supervision — Six Undergraduate Groups",
    org: "Department of CSE, BRAC University",
    meta: null,
    period: "May 2024 – Present",
    body: `I supervise six undergraduate thesis groups across two tracks. Track A, information
      extraction from specialist corpora, covers retrieval, extraction, and automated
      summarization over domain-specific technical documents. Track B, user behavior and update
      systems, covers ML-based engagement modeling, feedback pipelines, and behavioral analytics
      over longitudinal platform data.`,
  },
];

export const teaching = [
  {
    title: "Lecturer, Department of CSE",
    org: "BRAC University",
    meta: null,
    period: "May 2024 – Present",
    body: `I teach over 300 students per semester across CSE437 (Data Science), CSE422
      (Introduction to Machine Learning / Artificial Intelligence), CSE330 (Numerical Methods),
      and CSE440 (Natural Language Processing II Labs). I co-designed CSE437, and I am the sole
      designer of the CSE440 labs, for which I developed the full syllabus, assignment plans, and
      lab content from scratch.`,
  },
  {
    title: "Undergraduate Teaching Assistant",
    org: "BRAC University",
    meta: null,
    period: "Oct. 2022 – Dec. 2023",
    body: `I conducted lab sessions and led study groups for over 300 students in CSE220 (Data
      Structures), MAT215 (Mathematics for Machine Learning and Signal Processing), and PHY112
      (Principles of Physics II).`,
  },
];

// ---------------------------------------------------------------------------
// Not rendered. Cut from the page to keep it an academic profile rather than a
// CV transcript; the CV PDF carries all of it. Re-add a <Section> in page.tsx
// to bring any of these back.
// ---------------------------------------------------------------------------
export const industry = [
  {
    title: "Consultant, Data Architecture and Applied AI",
    org: "OneICT (client: National AgriCare Group)",
    meta: null,
    period: "Mar. 2026 – Aug. 2026",
    points: [
      `Re-architected the enterprise ERP system serving roughly 10,000 internal users across
       the group: ETL pipelines, data migration, backup strategy, and server provisioning.`,
      `Fine-tuned Arctic-Text2SQL-R1 on the company database schema for natural-language
       analytics extraction over production ERP data.`,
      `Built a RAG-based multi-tool agentic analytics pipeline on Gemma 4, delivering a
       conversational analytics chatbot for business users.`,
    ],
  },
  {
    title: "Machine Learning Team Lead",
    org: "Innospace Infotech Ltd.",
    meta: null,
    period: "Nov. 2024 – Present",
    points: [
      `Lead the AI/ML team building educational technology for Lecture Publications Ltd. and
       the Britto App, serving over 155,000 students.`,
      `Delivered a QA bot, question splitter, and analytics platform.`,
      `Architected the micro-service backend serving the platform, holding time-to-first-token
       at 5 seconds up to a knee of 3,000 concurrent users.`,
      `Designed reproducible ETL pipelines that reduced costs by 52%; built a Transformer
       sequence tagger with 3× speedup; implemented longitudinal tracking that raised
       engagement by 23%.`,
    ],
  },
  {
    title: "Data Scientist",
    org: "Robi Axiata Ltd.",
    meta: null,
    period: "Mar. 2024 – May 2024",
    points: [
      `Built predictive models over 47 million subjects using longitudinal transactional
       records spanning 170 TB.`,
      `Developed a user-facing AI chatbot with chain-of-thought reasoning and an HR-facing RAG
       system for internal query resolution.`,
    ],
  },
];

export const education = {
  degree: "B.Sc. in Computer Science and Engineering",
  org: "BRAC University",
  location: "Dhaka, Bangladesh",
  period: "Jan. 2020 – Dec. 2023",
  body: `Graduated with a CGPA of 4.00 / 4.00 on a 100% merit-based scholarship, with the
    Vice-Chancellor's Award. Thesis: destroR: Attacking Transfer Models with Obfuscous Examples to
    Discard Perplexity, advised by Dr. Farig Yousuf Sadeque, Associate Professor.`,
};

export const awards = [
  { period: "2020 – 2023", text: "100% Merit-Based Scholarship, BRAC University" },
  { period: "2020 – 2023", text: "Vice-Chancellor's Award for perfect 4.00 CGPA" },
  {
    period: "2023",
    text: "Top 12 Worldwide, SemEval 2023 Task 10 (EDOS), co-located with ACL 2023",
  },
];

export const service = [
  {
    title: "Volunteer Web Systems Development",
    org: "Department of CSE, BRAC University",
    meta: null,
    period: "May 2024 – Present",
    points: [
      `BRACU CSE SDS Portal: faculty management system centralizing administrative forms,
       resource requests, and workflows.`,
      `Thesis Group Management System: end-to-end thesis lifecycle covering registration,
       advisor assignment, proposal tracking, panel scheduling, and final mark submission.`,
      `Peer Evaluation System: anonymous faculty peer review with an LLM-based summarizer that
       preserves reviewer anonymity.`,
    ],
  },
  {
    title: "Lead Software Research Member",
    org: "Robotics and Intelligent Systems (RIS), BRAC University",
    meta: null,
    period: "Dec. 2021 – Dec. 2023",
    points: [
      `Led software development for robotics projects and mentored junior members on embedded
       systems.`,
    ],
  },
  {
    title: "Senior Executive, IT Department",
    org: "BRAC University Adventure Club",
    meta: null,
    period: "2021 – 2023",
    points: [],
  },
];

export const skills = [
  { label: "Languages", items: "Python, C, C++, TypeScript, JavaScript, Dart, WolframScript" },
  {
    label: "ML, NLP, and RAG",
    items: "Scikit-learn, HuggingFace Transformers, TensorFlow, TextAttack, NLTK, LangChain, vLLM, ChromaDB, Qdrant, BM25",
  },
  {
    label: "Infrastructure and Data",
    items: "AWS (SageMaker, Redshift), Docker, Kubernetes, Kafka, Apache Airflow, PostgreSQL, MongoDB, BigQuery, Groq",
  },
  { label: "Frameworks", items: "Flask, FastAPI, GraphQL, Flutter, CrewAI" },
  { label: "Spoken", items: "Bengali (native), English (fluent)" },
];
