const {v4: uuidv4} = require('uuid');
const items = [
    {
        id: "1",
        title: "Hera Dress",
        seller: "Alice Johnson",
        condition: "New",
        price: 39.99,
        details: "Elegant and stylish, perfect for evening events.",
        image: "/img/d1.png",
        active: true
    },
    {
        id: "2",
        title: "Formal Dress",
        seller: "Sophia Lee",
        condition: "Good",
        price: 59.99,
        details: "A timeless classic, ideal for formal occasions.",
        image: "/img/d2.png",
        active: true
    },
    {
        id: "3",
        title: "Mini Dress",
        seller: "Emily Carter",
        condition: "New",
        price: 54.49,
        details: "Chic and trendy, perfect for a night out.",
        image: "/img/d3.png",
        active: true
    },
    {
        id: "4",
        title: "Olive Green",
        seller: "Gwen Stacy",
        condition: "Like-New",
        price: 44.44,
        details: "A flattering satin mini dress, lightly worn.",
        image: "/img/d4.png",
        active: true
    },
    {
        id: "5",
        title: "Maxi Red Dress",
        seller: "Isabella Rose",
        condition: "Good",
        price: 23.56,
        details: "A flowy and elegant maxi dress, perfect for any occasion.",
        image: "/img/d5.png",
        active: true
    },
    {
        id: "6",
        title: "Long-Sleeves Dress",
        seller: "Olivia Bennett",
        condition: "Fair",
        price: 32.00,
        details: "Comfortable and stylish, great for casual outings.",
        image: "/img/d6.png",
        active: true
    },
];
module.exports = items;