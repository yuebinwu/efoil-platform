
export const products = [
  // ---电池產品---
  { 
    id: "battery-pro", 
    category: "battery", 
    title: "高性能電池組", 
    level: "專業玩家", 
    price: "$4,500", 
    img: "/battery-pro.jpg", // 確保檔案名稱與 public 資料夾中一致
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 102,
    desc: "高密度電芯，提供長達 90 分鐘續航。" 
  },
  { 
    id: "battery-mid", 
    category: "battery", 
    title: "全能型電池組", 
    level: "中級玩家", 
    price: "$3,200", 
    img: "/battery-intermediate.jpg", 
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 1011,
    desc: "平衡效能與重量，適合日常使用。" 
  },
  { 
    id: "battery-beg", 
    category: "battery", 
    title: "入門型電池組", 
    level: "新人", 
    price: "$1,800", 
    img: "/battery-beginner.jpg", 
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 10125,
    desc: "高性價比入門款，穩定耐用。" 
  },
  // --- 板类产品 ---
  {
    id: "board-beginner",
    category: "boards",
    title: "入门训练板",
    level: "新人",
    price: "$1,200",
    img: "/board-beginner.jpg", 
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 1,
    desc: "适合初学者的轻量化板材，稳定性极高。"
  },
  {
    id: "board-intermediate",
    category: "boards",
    title: "中级训练板",
    level: "中级骑手",
    price: "$1,500",
    img: "/board-beginner.jpg", 
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 107,
    desc: "适合初学者的轻量化板材，增加灵活性。"
  },
  {
    id: "board-pro",
    category: "boards",
    title: "专业竞技板",
    level: "专业玩家",
    price: "$2,800",
    img: "/board-pro.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 109,
    desc: "采用全碳纤维材质，追求极致速度。"
  },

  // --- 水翼套件 ---
  {
    id: "foil-beginner",
    category: "foil",
    title: "新人水翼套件",
    level: "基础型",
    price: "$1,500",
    img: "/foil-beginner.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 1000,
    desc: "平稳易控，适合各种水域。"
  },
    {
    id: "foil-intermadiate",
    category: "foil",
    title: "新人水翼套件",
    level: "进阶型",
    price: "$1,800",
    img: "/foil-intermediate.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 10111,
    desc: "增加灵活性，适合各种水域。"
  },
    {
    id: "foil-pro",
    category: "foil",
    title: "新人水翼套件",
    level: "竞技型",
    price: "$2,800",
    img: "/foil-pro.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 10,
    desc: "自由发挥，适合各种水域。"
  },


  // --- 动力系统 ---
  {
    id: "accessory-propulsion-motor",
    category: "propulsion",
    title: "静音动力电机",
    level: "动力型",
    price: "$2000",
    img: "/accessory-propulsion-motor.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 1,
    desc: "高效能、低噪音，带给你动力的感受。"
  },
  {
    id: "accessory-remote-pro",
    category: "propulsion",
    title: "遥控器",
    level: "全能型",
    price: "$1000",
    img: "/accessory-remote-pro.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 10,
    desc: "操控稳定，带给你操控的驾驶体验。"
  },

  // --- 配件 ---
  {
    id: "accessory-propulsion-connector",
    category: "accessories",
    title: "连接构建（套）",
    level: "必备",
    price: "$150",
    img: "/accessory-propulsion-connector.jpg",
    manualUrl: "/manuals/foil-beginner-manual.pdf",
    stock: 101,
    desc: "轻便透气，全方位保护您的安全。"
  }
];
