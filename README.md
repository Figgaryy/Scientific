# 📐 CSS322 Scientific Computing — Interactive Learning Site

สื่อการสอนแบบ Interactive Website สำหรับวิชา **CSS322 Scientific Computing** ครอบคลุมทั้งเนื้อหาทฤษฎี, สูตร, ตัวอย่างโจทย์พร้อมเฉลยละเอียด, และแบบทดสอบท้ายบท

🌐 **Live demo**: เปิด [`index.html`](index.html) ใน browser ได้ทันที (ไม่ต้อง install อะไร)

---

## 📚 เนื้อหาที่ครอบคลุม

### บทเรียน 5 บท
| บท | หัวข้อ | เนื้อหาหลัก |
|---|---|---|
| 1 | **Errors & Taylor Series** | Taylor series, Truncation error, True/Relative/Approximate error, D.P. & S.D., Round-off |
| 2 | **Root Finding (1D)** | Bisection, False Position, Newton-Raphson, Secant, Fixed-Point |
| 3 | **Linear Systems — Direct** | Gaussian Elimination, Partial Pivoting, Gauss-Jordan, Matrix Inverse, LU Decomposition |
| 4 | **Linear Systems — Iterative** | Vector/Matrix Norms, Jacobi, Gauss-Seidel, SOR, Convergence Analysis |
| 5 | **Nonlinear Systems** | Newton's Method (multi-variable + Jacobian), Fixed-Point Iteration |

### การบ้าน 4 ชุด
| HW | หัวข้อ |
|---|---|
| HW1 | Taylor Polynomial Error สำหรับ e⁻⁰·² |
| HW2 | Root Finding methods + Internal Rate of Return (ThaiESG) |
| HW3 | Jacobi & Gauss-Seidel iterations + Matrix T, c |
| HW4 | Nonlinear System ด้วย Newton & Fixed-Point |

---

## ✨ ฟีเจอร์

- ✅ **Interactive**: Accordion เปิด/ปิดเฉลย, Quiz พร้อม instant feedback
- ✅ **Progress tracking**: บันทึกความคืบหน้าและคะแนน quiz ผ่าน `localStorage`
- ✅ **Dark/Light mode**: สลับได้ + จำ preference
- ✅ **MathJax**: เรนเดอร์สูตรคณิตศาสตร์สวยงาม
- ✅ **Responsive**: เปิดในมือถือ/แท็บเล็ต/PC ได้
- ✅ **ภาษาไทย**: ใช้ font Sarabun/Noto Sans Thai
- ✅ **Offline-first**: ไม่ต้องต่ออินเทอร์เน็ต (ยกเว้น MathJax + fonts ที่โหลดจาก CDN)

---

## 📂 โครงสร้าง

```
website/
├── index.html              ← หน้าแรก (dashboard + navigation)
├── assets/
│   ├── style.css           ← ธีมสว่าง/มืด + responsive layout
│   └── app.js              ← nav, progress, quiz engine, theme toggle
├── chapters/
│   ├── ch1-errors-taylor.html
│   ├── ch2-root-finding.html
│   ├── ch3-linear-direct.html
│   ├── ch4-linear-iterative.html
│   └── ch5-nonlinear.html
├── homework/
│   ├── hw1.html
│   ├── hw2.html
│   ├── hw3.html
│   └── hw4.html
└── README.md
```

---

## 🚀 วิธีใช้งาน

### ใช้งาน Offline (แนะนำ)
1. Clone repo นี้:
   ```bash
   git clone https://github.com/Figgaryy/Scientific.git
   ```
2. เปิด `index.html` ใน browser (Chrome, Edge, Firefox, Safari)

### GitHub Pages
สามารถเปิดใช้ GitHub Pages เพื่อ host เว็บไซต์ได้:
1. ไปที่ **Settings → Pages**
2. เลือก **Source: main branch / root**
3. เว็บจะพร้อมใช้ที่ `https://figgaryy.github.io/Scientific/`

---

## 🎓 Credits

- อ้างอิงเนื้อหา: CSS322 Scientific Computing lecture notes โดย ©Saifon C.
- สร้างด้วยความช่วยเหลือของ Claude Code

---

## 📄 License

Educational use — ห้ามนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต
