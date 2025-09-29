// App.js - Главный компонент
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Clock, ShoppingCart, MessageSquare, 
  Download, Search, Plus, Minus, User, Bell,
  TrendingUp, Package, FileText, Users
} from 'lucide-react';

// Демо-данные
const demoSuppliers = [
  {
    id: 1,
    name: "Fresh Meat Co.",
    category: "Мясо",
    rating: 4.8,
    available: 150,
    price: 1200,
    unit: "кг",
    deliveryTime: "2-3 часа"
  },
  {
    id: 2,
    name: "Green Vegetables",
    category: "Овощи",
    rating: 4.6,
    available: 300,
    price: 350,
    unit: "кг",
    deliveryTime: "1-2 часа"
  },
  {
    id: 3,
    name: "Dairy Premium",
    category: "Молочные продукты",
    rating: 4.9,
    available: 200,
    price: 280,
    unit: "л",
    deliveryTime: "3-4 часа"
  },
  {
    id: 4,
    name: "Sea Fresh",
    category: "Рыба и морепродукты",
    rating: 4.7,
    available: 80,
    price: 1800,
    unit: "кг",
    deliveryTime: "4-5 часов"
  },
  {
    id: 5,
    name: "Bakery House",
    category: "Хлеб и выпечка",
    rating: 4.5,
    available: 120,
    price: 150,
    unit: "шт",
    deliveryTime: "1 час"
  },
  {
    id: 6,
    name: "Beverage World",
    category: "Напитки",
    rating: 4.4,
    available: 250,
    price: 220,
    unit: "л",
    deliveryTime: "2-3 часа"
  }
];

const demoOrderTemplates = [
  {
    id: 1,
    name: "Еженедельный запас мяса",
    items: "Говядина, курица, свинина",
    total: 35400
  },
  {
    id: 2,
    name: "Овощной набор",
    items: "Помидоры, огурцы, салат, зелень",
    total: 12500
  },
  {
    id: 3,
    name: "Барный заказ",
    items: "Напитки, лёд, закуски",
    total: 21800
  }
];

const demoDocuments = [
  { id: 1, name: "Накладная #2456", date: "2024-01-15", amount: 45600, type: "invoice" },
  { id: 2, name: "Счет #2457", date: "2024-01-14", amount: 23400, type: "bill" },
  { id: 3, name: "Накладная #2455", date: "2024-01-13", amount: 18900, type: "invoice" },
  { id: 4, name: "Счет #2454", date: "2024-01-12", amount: 56700, type: "bill" }
];

const demoMessages = [
  { id: 1, text: "Здравствуйте! Заказ будет доставлен в течение 2 часов.", sender: "supplier", time: "10:30" },
  { id: 2, text: "Спасибо! Ждём доставку.", sender: "me", time: "10:32" },
  { id: 3, text: "Появились свежие морепродукты, интересно?", sender: "supplier", time: "11:15" }
];

const demoAnalytics = [
  { category: "Мясо", amount: 125400, percentage: 35 },
  { category: "Овощи", amount: 78400, percentage: 22 },
  { category: "Напитки", amount: 65400, percentage: 18 },
  { category: "Молочные продукты", amount: 43200, percentage: 12 },
  { category: "Рыба", amount: 39800, percentage: 11 },
  { category: "Прочее", amount: 15600, percentage: 4 }
];

const App = () => {
  // Состояния
  const [suppliers, setSuppliers] = useState(demoSuppliers);
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState(demoMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Статистика
  const topStats = {
    orders: 24,
    savings: 12500,
    topSupplier: "Fresh Meat Co.",
    nextDelivery: "2 часа 30 мин"
  };

  // Фильтрация поставщиков
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesCategory = activeCategory === 'Все' || supplier.category === activeCategory;
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Категории для фильтра
  const categories = ['Все', ...new Set(suppliers.map(s => s.category))];

  // Функции для корзины
  const addToCart = (supplier, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === supplier.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === supplier.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...supplier, quantity }];
      }
    });
  };

  const updateQuantity = (id, change) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean);
      
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Функции для чата
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Авто-ответ
      setTimeout(() => {
        const autoReply = {
          id: messages.length + 2,
          text: "Получили ваше сообщение. Ответим в ближайшее время!",
          sender: 'supplier',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Применение шаблона
  const applyTemplate = (template) => {
    // В реальном приложении здесь была бы логика добавления товаров из шаблона
    alert(`Шаблон "${template.name}" применен!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Хедер */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Панель ресторатора — Demo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Ресторан "La Bella"</p>
                <p className="text-sm text-gray-500">Тариф: Премиум</p>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-green-700">Баланс: 45,800 ₽</span>
                <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors">
                  Пополнить
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Топ-статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Заказы в этом месяце</p>
                <p className="text-2xl font-bold text-gray-900">{topStats.orders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Суммарная экономия</p>
                <p className="text-2xl font-bold text-gray-900">{topStats.savings.toLocaleString()} ₽</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Топ-поставщик</p>
                <p className="text-lg font-bold text-gray-900 truncate">{topStats.topSupplier}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">До следующей доставки</p>
                <p className="text-2xl font-bold text-gray-900">{topStats.nextDelivery}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Каталог поставщиков */}
          <div className="lg:col-span-2 space-y-6">
            {/* Каталог поставщиков */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Каталог поставщиков</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск поставщиков..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Фильтры по категориям */}
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Список поставщиков */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSuppliers.map(supplier => (
                  <div key={supplier.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                        <p className="text-sm text-gray-500">{supplier.category}</p>
                      </div>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <span className="text-sm font-medium text-blue-700">{supplier.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{supplier.price} ₽</p>
                        <p className="text-sm text-gray-500">за {supplier.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Доступно: {supplier.available}</p>
                        <p className="text-xs text-gray-500">{supplier.deliveryTime}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(supplier, 1)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        +1 в корзину
                      </button>
                      <button
                        onClick={() => addToCart(supplier, 5)}
                        className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => addToCart(supplier, 10)}
                        className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Шаблоны заказов */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Шаблоны заказов</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demoOrderTemplates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.items}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">{template.total.toLocaleString()} ₽</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => applyTemplate(template)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Применить
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                          Редактировать
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Документы */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Документы</h2>
              <div className="space-y-3">
                {demoDocuments.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.date} • {doc.amount.toLocaleString()} ₽</p>
                    </div>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                      <Download className="h-4 w-4 mr-1" />
                      Скачать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            {/* Корзина */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <ShoppingCart className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Корзина</h2>
                {cart.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.price} ₽/{item.unit}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Итого:</span>
                      <span className="text-2xl font-bold text-gray-900">{getCartTotal().toLocaleString()} ₽</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Оформить заказ
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Чат с поставщиками */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Чат с поставщиками</h2>
              </div>

              <div className="h-80 overflow-y-auto mb-4 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Отправить
                </button>
              </div>
            </div>

            {/* Аналитика расходов */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Аналитика расходов</h2>
              </div>

              <div className="space-y-3">
                {demoAnalytics.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className="text-gray-900">{item.amount.toLocaleString()} ₽ ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;