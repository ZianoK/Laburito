export const CATEGORIES = [
    { id: 'all', name: 'Todos', icon: 'LayoutGrid' },
    { id: 'plomeria', name: 'Plomería', icon: 'Wrench' },
    { id: 'electricidad', name: 'Electricidad', icon: 'Zap' },
    { id: 'jardineria', name: 'Jardinería', icon: 'Sprout' },
    { id: 'carpinteria', name: 'Carpintería', icon: 'Hammer' },
    { id: 'limpieza', name: 'Limpieza', icon: 'Sparkles' },
    { id: 'pintura', name: 'Pintura', icon: 'Paintbrush' },
];

export const PRESTIGE_LEVELS = {
    BRONZE: { id: 'bronze', label: 'Bronce', color: 'var(--prestige-bronze)' },
    SILVER: { id: 'silver', label: 'Plata', color: 'var(--prestige-silver)' },
    GOLD: { id: 'gold', label: 'Oro', color: 'var(--prestige-gold)' },
    PLATINUM: { id: 'platinum', label: 'Platino', color: 'var(--prestige-platinum)' },
};

export const MOCK_SERVICES = [
    {
        id: 1,
        name: "Mario Rossi",
        category: "plomeria",
        serviceTitle: "Plomería General y Urgencias 24hs",
        price: 5000,
        rating: 4.8,
        reviews: 124,
        prestige: "GOLD",
        location: { lat: -34.6037, lng: -58.3816, address: "Av. Corrientes 1234" },
        image: "https://images.unsplash.com/photo-1581578014828-160fa1185011?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 350,
        contact: { phone: "11-1234-5678", email: "mario.plomeria@email.com", whatsapp: "5491112345678" },
        sellerId: 'u2', // Linked to Mario Plomero
        paymentMethods: ["Efectivo", "Transferencia", "Mercado Pago"],
        discounts: { "Efectivo": 0.10 },
        serviceTypes: [
            { id: 'p1', name: "Visita y Diagnóstico", price: 5000, type: "fixed" },
            { id: 'p2', name: "Destapación de Cañería", price: 15000, type: "fixed" },
            { id: 'p3', name: "Cambio de Grifería", price: 8000, type: "fixed" },
            { id: 'p4', name: "Hora de Trabajo General", price: 6000, type: "hourly" }
        ]
    },
    {
        id: 2,
        name: "ElectroFast S.A.",
        category: "electricidad",
        serviceTitle: "Instalaciones Eléctricas Domiciliarias",
        price: 4500,
        rating: 4.5,
        reviews: 89,
        prestige: "SILVER",
        location: { lat: -34.5997, lng: -58.3916, address: "Callao 456" },
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 210,
        contact: { phone: "11-8765-4321", email: "contacto@electrofast.com.ar", whatsapp: "5491187654321" },
        sellerId: 'u3', // Linked to Servicios SA
        paymentMethods: ["Efectivo", "Tarjeta de Crédito", "Transferencia"],
        discounts: { "Transferencia": 0.05 },
        serviceTypes: [
            { id: 'e1', name: "Revisión Eléctrica", price: 4500, type: "fixed" },
            { id: 'e2', name: "Instalación de Tomacorriente", price: 3000, type: "fixed" },
            { id: 'e3', name: "Hora de Trabajo", price: 5500, type: "hourly" }
        ]
    },
    {
        id: 3,
        name: "Jardines Verdes",
        category: "jardineria",
        serviceTitle: "Diseño y Manguenimiento de Jardines",
        price: 3500,
        rating: 4.9,
        reviews: 215,
        prestige: "PLATINUM",
        location: { lat: -34.5887, lng: -58.4016, address: "Av. Las Heras 2300" },
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 500,
        contact: { phone: "11-5555-0000", email: "info@jardinesverdes.com", whatsapp: "5491155550000" },
        paymentMethods: ["Efectivo", "Transferencia"],
        discounts: {},
        serviceTypes: [
            { id: 'j1', name: "Corte de Pasto (hasta 50m2)", price: 3500, type: "fixed" },
            { id: 'j2', name: "Poda de Arbustos", price: 4000, type: "hourly" },
            { id: 'j3', name: "Diseño de Paisajismo", price: 12000, type: "fixed" }
        ]
    },
    {
        id: 4,
        name: "Carpintería El Roble",
        category: "carpinteria",
        serviceTitle: "Muebles a Medida y Restauraciones",
        price: 8000,
        rating: 4.7,
        reviews: 67,
        prestige: "BRONZE",
        location: { lat: -34.6137, lng: -58.3716, address: "San Telmo" },
        image: "https://images.unsplash.com/photo-1622323758558-8d776735be9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 85,
        contact: { phone: "11-4444-2222", email: "elroble@carpinteria.com", whatsapp: "" },
        paymentMethods: ["Efectivo"],
        discounts: { "Efectivo": 0.15 },
        serviceTypes: [
            { id: 'c1', name: "Restauración Silla", price: 8000, type: "fixed" },
            { id: 'c2', name: "Mueble a Medida (Metro Lineal)", price: 45000, type: "fixed" }
        ]
    },
    {
        id: 5,
        name: "Limpieza Total",
        category: "limpieza",
        serviceTitle: "Limpieza Profunda de Casas y Oficinas",
        price: 3000,
        rating: 4.6,
        reviews: 156,
        prestige: "SILVER",
        location: { lat: -34.6237, lng: -58.4116, address: "Caballito" },
        image: "https://images.unsplash.com/photo-1581578014828-160fa1185011?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 280,
        contact: { phone: "11-3333-9999", email: "hola@limpiezatotal.com.ar", whatsapp: "5491133339999" },
        paymentMethods: ["Efectivo", "Mercado Pago"],
        discounts: {},
        serviceTypes: [
            { id: 'l1', name: "Limpieza por Hora", price: 3000, type: "hourly" },
            { id: 'l2', name: "Limpieza Final de Obra", price: 50000, type: "fixed" }
        ]
    },
    {
        id: 6,
        name: "Pinturas al Detalle",
        category: "pintura",
        serviceTitle: "Pintura de Interiores y Exteriores",
        price: 4200,
        rating: 5.0,
        reviews: 45,
        prestige: "GOLD",
        location: { lat: -34.5737, lng: -58.4216, address: "Palermo" },
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 120,
        contact: { phone: "11-6666-7777", email: "detalles@pintura.com", whatsapp: "5491166667777" },
        paymentMethods: ["Efectivo", "Transferencia", "Tarjeta de Débito"],
        discounts: { "Efectivo": 0.05 },
        serviceTypes: [
            { id: 'pi1', name: "Pintura Muro (m2)", price: 4200, type: "fixed" },
            { id: 'pi2', name: "Jornada Completa", price: 35000, type: "fixed" }
        ]
    },
    {
        id: 7,
        name: "Constructora BuildIt",
        category: "albañileria",
        serviceTitle: "Construcción y Refacciones Generales",
        price: 15000,
        rating: 4.7,
        reviews: 32,
        prestige: "PLATINUM",
        location: { lat: -34.6157, lng: -58.3916, address: "Boedo" },
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        jobsCompleted: 45,
        contact: { phone: "11-9988-7766", email: "obras@buildit.com", whatsapp: "5491199887766" },
        paymentMethods: ["Transferencia", "Efectivo", "Cheque"],
        discounts: { "Efectivo": 0.05 },
        serviceTypes: [
            { id: 'a1', name: "Colocación de Cerámicos", price: 6500, type: "variable", unit: "m²", unitLabel: "metros cuadrados" },
            { id: 'a2', name: "Construcción de Muro", price: 12000, type: "variable", unit: "m²", unitLabel: "metros cuadrados" },
            { id: 'a3', name: "Refacción Completa de Baño", price: 0, type: "quote" }
        ]
    }
];
