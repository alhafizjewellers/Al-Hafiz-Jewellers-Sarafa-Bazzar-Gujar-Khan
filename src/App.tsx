import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  ChevronDown, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Search,
  X,
  ShoppingBag,
  Award,
  Heart,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  Settings
} from 'lucide-react'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Product data
const products = [
  { id: 1, name: 'Classic Gold Band', price: 'PKR 45,000', image: '/images/product_ring_band.jpg' },
  { id: 2, name: 'Twisted Rope Ring', price: 'PKR 38,000', image: '/images/product_ring_rope.jpg' },
  { id: 3, name: 'Curb Chain Bracelet', price: 'PKR 92,000', image: '/images/product_bracelet_curb.jpg' },
  { id: 4, name: 'Polished Bangle', price: 'PKR 110,000', image: '/images/product_bangle.jpg' },
  { id: 5, name: 'Minimal Hoop Set', price: 'PKR 28,000', image: '/images/product_hoops.jpg' },
  { id: 6, name: 'Heritage Pendant', price: 'PKR 67,000', image: '/images/product_pendant.jpg' },
]

// Receipt type
interface Receipt {
  code: string
  itemName: string
  purchaseDate: string
  purity: string
  netWeight: string
  warrantyStatus: string
  price: string
  customerName?: string
  customerPhone?: string
}

// Default receipts
const defaultReceipts: Record<string, Receipt> = {
  '1234': {
    code: '1234',
    itemName: 'Classic Gold Band',
    purchaseDate: '2026-01-15',
    purity: '22K (91.6%)',
    netWeight: '4.5g',
    warrantyStatus: 'Active (1 year)',
    price: 'PKR 45,000',
    customerName: 'Ahmed Khan',
    customerPhone: '+92 300 1234567'
  },
  '5678': {
    code: '5678',
    itemName: 'Curb Chain Bracelet',
    purchaseDate: '2026-01-20',
    purity: '21K (87.5%)',
    netWeight: '12.3g',
    warrantyStatus: 'Active (1 year)',
    price: 'PKR 92,000',
    customerName: 'Fatima Ali',
    customerPhone: '+92 321 7654321'
  },
  '9012': {
    code: '9012',
    itemName: 'Heritage Pendant',
    purchaseDate: '2026-01-25',
    purity: '22K (91.6%)',
    netWeight: '6.8g',
    warrantyStatus: 'Active (1 year)',
    price: 'PKR 67,000',
    customerName: 'Muhammad Rizwan',
    customerPhone: '+92 333 9876543'
  }
}

// Admin credentials (in production, use proper authentication)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'hafiz123'

function App() {
  // View state
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'adminDashboard'>('home')
  
  // Admin auth state
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  
  // Receipts state (persisted to localStorage)
  const [receipts, setReceipts] = useState<Record<string, Receipt>>({})
  
  // Receipt lookup state
  const [receiptCode, setReceiptCode] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [receiptData, setReceiptData] = useState<Receipt | null>(null)
  const [lookupError, setLookupError] = useState('')
  
  // Admin dashboard state
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // New receipt form
  const [newReceipt, setNewReceipt] = useState<Partial<Receipt>>({
    code: '',
    itemName: '',
    purchaseDate: '',
    purity: '22K (91.6%)',
    netWeight: '',
    warrantyStatus: 'Active (1 year)',
    price: '',
    customerName: '',
    customerPhone: ''
  })
  
  const [navOpen, setNavOpen] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const craftRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const lookupRef = useRef<HTMLDivElement>(null)

  // Load receipts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('alhafiz_receipts')
    if (saved) {
      setReceipts(JSON.parse(saved))
    } else {
      setReceipts(defaultReceipts)
      localStorage.setItem('alhafiz_receipts', JSON.stringify(defaultReceipts))
    }
  }, [])

  // Save receipts to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(receipts).length > 0) {
      localStorage.setItem('alhafiz_receipts', JSON.stringify(receipts))
    }
  }, [receipts])

  useEffect(() => {
    if (currentView !== 'home') return
    
    // Hero entrance animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      
      tl.from('.hero-bg', {
        opacity: 0,
        scale: 1.06,
        duration: 1.1,
        ease: 'power2.out'
      })
      .from('.hero-title span', {
        opacity: 0,
        y: 24,
        rotateX: 18,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-subtitle', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power2.out'
      }, '-=0.4')
      .from('.hero-cta', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out'
      }, '-=0.5')
      .from('.lookup-widget', {
        opacity: 0,
        x: 80,
        rotateY: -10,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.scroll-hint', {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')

      // Hero scroll exit animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set('.hero-content', {
              x: -18 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.75
            })
            gsap.set('.lookup-widget', {
              x: 10 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.65
            })
            gsap.set('.hero-bg', {
              scale: 1 + 0.08 * exitProgress,
              x: -4 * exitProgress + 'vw'
            })
          }
        }
      })

      // Craft section animation
      ScrollTrigger.create({
        trigger: craftRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set('.craft-bg', {
              scale: 1.10 - 0.10 * entranceProgress,
              x: 6 * (1 - entranceProgress) + 'vw'
            })
            gsap.set('.craft-title', {
              opacity: entranceProgress,
              y: 28 * (1 - entranceProgress),
              rotateX: 16 * (1 - entranceProgress)
            })
            gsap.set('.craft-point', {
              opacity: entranceProgress,
              x: -10 * (1 - entranceProgress) + 'vw',
              stagger: 0.1
            })
          }
          else if (progress <= 0.7) {
            gsap.set('.craft-bg', { scale: 1, x: 0 })
            gsap.set('.craft-title', { opacity: 1, y: 0, rotateX: 0 })
            gsap.set('.craft-point', { opacity: 1, x: 0 })
          }
          else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set('.craft-title', {
              x: -16 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.7
            })
            gsap.set('.craft-point', {
              y: 10 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.75
            })
            gsap.set('.craft-bg', {
              scale: 1 + 0.07 * exitProgress,
              x: -5 * exitProgress + 'vw'
            })
          }
        }
      })

      // Featured section animation
      ScrollTrigger.create({
        trigger: featuredRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          const progress = self.progress
          
          if (progress <= 0.3) {
            const entranceProgress = progress / 0.3
            gsap.set('.featured-bg', {
              scale: 1.12 - 0.12 * entranceProgress,
              x: -6 * (1 - entranceProgress) + 'vw'
            })
            gsap.set('.featured-title', {
              opacity: entranceProgress,
              x: -18 * (1 - entranceProgress) + 'vw',
              rotateY: 12 * (1 - entranceProgress)
            })
            gsap.set('.featured-subtitle, .featured-cta', {
              opacity: entranceProgress,
              y: 18 * (1 - entranceProgress)
            })
          }
          else if (progress <= 0.7) {
            gsap.set('.featured-bg', { scale: 1, x: 0 })
            gsap.set('.featured-title', { opacity: 1, x: 0, rotateY: 0 })
            gsap.set('.featured-subtitle, .featured-cta', { opacity: 1, y: 0 })
          }
          else {
            const exitProgress = (progress - 0.7) / 0.3
            gsap.set('.featured-title', {
              x: -14 * exitProgress + 'vw',
              opacity: 1 - exitProgress * 0.7
            })
            gsap.set('.featured-subtitle, .featured-cta', {
              y: 8 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.75
            })
            gsap.set('.featured-bg', {
              scale: 1 + 0.08 * exitProgress,
              x: 4 * exitProgress + 'vw'
            })
          }
        }
      })

      // Collection section scroll animation
      gsap.from('.collection-title', {
        scrollTrigger: {
          trigger: '.collection-section',
          start: 'top 80%',
          end: 'top 55%',
          scrub: true
        },
        opacity: 0,
        y: 30
      })

      gsap.from('.product-card', {
        scrollTrigger: {
          trigger: '.products-grid',
          start: 'top 80%',
          end: 'top 40%',
          scrub: true
        },
        opacity: 0,
        y: 60,
        scale: 0.98,
        stagger: 0.08
      })

      // Lookup section animation
      gsap.from('.lookup-title', {
        scrollTrigger: {
          trigger: lookupRef.current,
          start: 'top 80%',
          end: 'top 55%',
          scrub: true
        },
        opacity: 0,
        y: 30
      })

      gsap.from('.lookup-form-card', {
        scrollTrigger: {
          trigger: lookupRef.current,
          start: 'top 75%',
          end: 'top 50%',
          scrub: true
        },
        opacity: 0,
        x: 100,
        rotateY: -8
      })

      // About section animation
      gsap.from('.about-title, .about-story', {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 80%',
          end: 'top 55%',
          scrub: true
        },
        opacity: 0,
        y: 28
      })

      gsap.from('.contact-card', {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 70%',
          end: 'top 45%',
          scrub: true
        },
        opacity: 0,
        y: 40,
        scale: 0.98
      })

      // Footer animation
      gsap.from('.footer-content', {
        scrollTrigger: {
          trigger: '.footer-section',
          start: 'top 90%',
          end: 'top 70%',
          scrub: true
        },
        opacity: 0,
        y: 16
      })
    })

    return () => ctx.revert()
  }, [currentView])

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (receiptCode.length !== 4 || !/^\d{4}$/.test(receiptCode)) {
      setLookupError('Please enter a valid 4-digit code')
      return
    }

    const data = receipts[receiptCode]
    if (data) {
      setReceiptData(data)
      setLookupError('')
      setShowModal(true)
    } else {
      setLookupError('No purchase found with this code. Please check and try again.')
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setAdminError('')
      setCurrentView('adminDashboard')
      setAdminUsername('')
      setAdminPassword('')
    } else {
      setAdminError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    setCurrentView('home')
    setShowAddForm(false)
    setEditingCode(null)
  }

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newReceipt.code || !newReceipt.itemName || !newReceipt.purchaseDate || !newReceipt.price) {
      alert('Please fill in all required fields')
      return
    }

    if (newReceipt.code.length !== 4 || !/^\d{4}$/.test(newReceipt.code)) {
      alert('Code must be exactly 4 digits')
      return
    }

    if (receipts[newReceipt.code] && editingCode !== newReceipt.code) {
      alert('This code already exists!')
      return
    }

    const receipt: Receipt = {
      code: newReceipt.code,
      itemName: newReceipt.itemName,
      purchaseDate: newReceipt.purchaseDate,
      purity: newReceipt.purity || '22K (91.6%)',
      netWeight: newReceipt.netWeight || '',
      warrantyStatus: newReceipt.warrantyStatus || 'Active (1 year)',
      price: newReceipt.price,
      customerName: newReceipt.customerName,
      customerPhone: newReceipt.customerPhone
    }

    setReceipts(prev => ({
      ...prev,
      [receipt.code]: receipt
    }))

    // Reset form
    setNewReceipt({
      code: '',
      itemName: '',
      purchaseDate: '',
      purity: '22K (91.6%)',
      netWeight: '',
      warrantyStatus: 'Active (1 year)',
      price: '',
      customerName: '',
      customerPhone: ''
    })
    setShowAddForm(false)
    setEditingCode(null)
  }

  const handleDeleteReceipt = (code: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      const updated = { ...receipts }
      delete updated[code]
      setReceipts(updated)
    }
  }

  const handleEditReceipt = (receipt: Receipt) => {
    setNewReceipt(receipt)
    setEditingCode(receipt.code)
    setShowAddForm(true)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setNavOpen(false)
  }

  // Filter receipts for search
  const filteredReceipts = Object.values(receipts).filter(r => 
    r.code.includes(searchQuery) ||
    r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.customerName && r.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Admin Login View
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
        <div className="noise-overlay" />
        <div className="relative z-10 bg-[#141419] border border-[#D6B56A]/30 rounded-xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D6B56A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#D6B56A]" size={32} />
            </div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Admin <span className="text-[#D6B56A]">Login</span>
            </h2>
            <p className="text-[#B8B2AA] mt-2">Access the receipt management system</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[#B8B2AA] mb-2">Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="input-gold w-full"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm text-[#B8B2AA] mb-2">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="input-gold w-full"
                placeholder="Enter password"
              />
            </div>
            {adminError && (
              <p className="text-red-400 text-sm">{adminError}</p>
            )}
            <button type="submit" className="btn-gold-filled w-full">
              Login
            </button>
          </form>

          <button 
            onClick={() => setCurrentView('home')}
            className="w-full text-center text-[#B8B2AA] mt-6 hover:text-[#D6B56A] transition-colors"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    )
  }

  // Admin Dashboard View
  if (currentView === 'adminDashboard') {
    return (
      <div className="min-h-screen bg-[#0B0B0D] text-[#F4F1EA]">
        <div className="noise-overlay" />
        
        {/* Admin Header */}
        <nav className="relative z-10 bg-[#141419] border-b border-[#D6B56A]/30 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Settings className="text-[#D6B56A]" size={24} />
              <h1 className="text-xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Admin <span className="text-[#D6B56A]">Dashboard</span>
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#B8B2AA] hover:text-[#D6B56A] transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#141419] border border-[#D6B56A]/20 rounded-xl p-6">
              <p className="text-[#B8B2AA] text-sm mb-2">Total Receipts</p>
              <p className="text-3xl font-bold text-[#D6B56A]">{Object.keys(receipts).length}</p>
            </div>
            <div className="bg-[#141419] border border-[#D6B56A]/20 rounded-xl p-6">
              <p className="text-[#B8B2AA] text-sm mb-2">Active Warranties</p>
              <p className="text-3xl font-bold text-green-400">
                {Object.values(receipts).filter(r => r.warrantyStatus.includes('Active')).length}
              </p>
            </div>
            <div className="bg-[#141419] border border-[#D6B56A]/20 rounded-xl p-6">
              <p className="text-[#B8B2AA] text-sm mb-2">Demo Codes</p>
              <p className="text-lg text-[#F4F1EA]">1234, 5678, 9012</p>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B2AA]" size={20} />
              <input
                type="text"
                placeholder="Search by code, item name, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-gold w-full pl-12"
              />
            </div>
            <button 
              onClick={() => {
                setShowAddForm(!showAddForm)
                setEditingCode(null)
                setNewReceipt({
                  code: '',
                  itemName: '',
                  purchaseDate: '',
                  purity: '22K (91.6%)',
                  netWeight: '',
                  warrantyStatus: 'Active (1 year)',
                  price: '',
                  customerName: '',
                  customerPhone: ''
                })
              }}
              className="btn-gold-filled flex items-center gap-2"
            >
              <Plus size={20} />
              {showAddForm ? 'Cancel' : 'Add Receipt'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-[#141419] border border-[#D6B56A]/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {editingCode ? 'Edit' : 'Add New'} <span className="text-[#D6B56A]">Receipt</span>
              </h3>
              <form onSubmit={handleAddReceipt} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">4-Digit Code *</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newReceipt.code}
                    onChange={(e) => setNewReceipt({...newReceipt, code: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                    className="input-gold w-full"
                    placeholder="e.g., 1234"
                    disabled={editingCode !== null}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newReceipt.itemName}
                    onChange={(e) => setNewReceipt({...newReceipt, itemName: e.target.value})}
                    className="input-gold w-full"
                    placeholder="e.g., Classic Gold Band"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Purchase Date *</label>
                  <input
                    type="date"
                    value={newReceipt.purchaseDate}
                    onChange={(e) => setNewReceipt({...newReceipt, purchaseDate: e.target.value})}
                    className="input-gold w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Purity</label>
                  <select
                    value={newReceipt.purity}
                    onChange={(e) => setNewReceipt({...newReceipt, purity: e.target.value})}
                    className="input-gold w-full"
                  >
                    <option>24K (99.9%)</option>
                    <option>22K (91.6%)</option>
                    <option>21K (87.5%)</option>
                    <option>18K (75%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Net Weight</label>
                  <input
                    type="text"
                    value={newReceipt.netWeight}
                    onChange={(e) => setNewReceipt({...newReceipt, netWeight: e.target.value})}
                    className="input-gold w-full"
                    placeholder="e.g., 4.5g"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Price *</label>
                  <input
                    type="text"
                    value={newReceipt.price}
                    onChange={(e) => setNewReceipt({...newReceipt, price: e.target.value})}
                    className="input-gold w-full"
                    placeholder="e.g., PKR 45,000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Warranty Status</label>
                  <select
                    value={newReceipt.warrantyStatus}
                    onChange={(e) => setNewReceipt({...newReceipt, warrantyStatus: e.target.value})}
                    className="input-gold w-full"
                  >
                    <option>Active (1 year)</option>
                    <option>Active (2 years)</option>
                    <option>Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newReceipt.customerName}
                    onChange={(e) => setNewReceipt({...newReceipt, customerName: e.target.value})}
                    className="input-gold w-full"
                    placeholder="e.g., Ahmed Khan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#B8B2AA] mb-2">Customer Phone</label>
                  <input
                    type="text"
                    value={newReceipt.customerPhone}
                    onChange={(e) => setNewReceipt({...newReceipt, customerPhone: e.target.value})}
                    className="input-gold w-full"
                    placeholder="e.g., +92 300 1234567"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <button type="submit" className="btn-gold-filled flex items-center gap-2">
                    <Save size={20} />
                    {editingCode ? 'Update Receipt' : 'Save Receipt'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Receipts Table */}
          <div className="bg-[#141419] border border-[#D6B56A]/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#D6B56A]/10">
                  <tr>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Code</th>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Item</th>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Date</th>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Price</th>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Customer</th>
                    <th className="text-left px-4 py-3 text-[#D6B56A] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#B8B2AA]">
                        No receipts found
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((receipt) => (
                      <tr key={receipt.code} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-[#D6B56A]">{receipt.code}</td>
                        <td className="px-4 py-3">{receipt.itemName}</td>
                        <td className="px-4 py-3 text-[#B8B2AA]">{receipt.purchaseDate}</td>
                        <td className="px-4 py-3">{receipt.price}</td>
                        <td className="px-4 py-3 text-[#B8B2AA]">{receipt.customerName || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditReceipt(receipt)}
                              className="p-2 text-[#D6B56A] hover:bg-[#D6B56A]/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteReceipt(receipt.code)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Home View (Original Website)
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F4F1EA] overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Al <span className="text-[#D6B56A]">Hafiz</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('collection')} className="text-sm text-[#B8B2AA] hover:text-[#D6B56A] transition-colors">Collection</button>
            <button onClick={() => scrollToSection('craft')} className="text-sm text-[#B8B2AA] hover:text-[#D6B56A] transition-colors">Craft</button>
            <button onClick={() => scrollToSection('lookup')} className="text-sm text-[#B8B2AA] hover:text-[#D6B56A] transition-colors">Lookup</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm text-[#B8B2AA] hover:text-[#D6B56A] transition-colors">Contact</button>
            <button 
              onClick={() => setCurrentView('admin')}
              className="text-sm text-[#D6B56A] border border-[#D6B56A]/50 px-4 py-2 rounded-lg hover:bg-[#D6B56A]/10 transition-colors flex items-center gap-2"
            >
              <Lock size={14} />
              Admin
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#F4F1EA]"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X size={24} /> : <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
            </div>}
          </button>
        </div>

        {/* Mobile Nav */}
        {navOpen && (
          <div className="md:hidden bg-[#0B0B0D]/95 border-t border-white/5 px-6 py-4 space-y-4">
            <button onClick={() => scrollToSection('collection')} className="block w-full text-left text-[#B8B2AA] hover:text-[#D6B56A]">Collection</button>
            <button onClick={() => scrollToSection('craft')} className="block w-full text-left text-[#B8B2AA] hover:text-[#D6B56A]">Craft</button>
            <button onClick={() => scrollToSection('lookup')} className="block w-full text-left text-[#B8B2AA] hover:text-[#D6B56A]">Lookup</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-[#B8B2AA] hover:text-[#D6B56A]">Contact</button>
            <button 
              onClick={() => setCurrentView('admin')}
              className="block w-full text-left text-[#D6B56A] flex items-center gap-2"
            >
              <Lock size={16} />
              Admin Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <div className="hero-bg absolute inset-0">
          <img 
            src="/images/hero_bracelet.jpg" 
            alt="Gold Bracelet" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/80 via-[#0B0B0D]/40 to-[#0B0B0D]/70" />
        </div>

        <div className="relative z-10 h-full flex items-center px-6 lg:px-12 pt-20">
          <div className="hero-content max-w-2xl">
            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="block">PURE</span>
              <span className="block text-[#D6B56A]">GOLD.</span>
              <span className="block">PURE</span>
              <span className="block text-[#D6B56A]">ELEGANCE.</span>
            </h1>
            <p className="hero-subtitle text-lg md:text-xl text-[#B8B2AA] mb-8 max-w-lg">
              Hand-finished jewellery, certified purity, and a purchase record you can retrieve anytime.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('collection')}
                className="hero-cta btn-gold-filled"
              >
                Explore the Collection
              </button>
              <button 
                onClick={() => scrollToSection('lookup')}
                className="hero-cta btn-gold"
              >
                Verify a Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Floating Lookup Widget */}
        <div className="lookup-widget hidden lg:block absolute right-12 top-1/3 w-72 bg-[#141419]/90 backdrop-blur-md border border-[#D6B56A]/30 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Lost your receipt?
          </h3>
          <p className="text-sm text-[#B8B2AA] mb-4">
            Enter your 4-digit code to view purchase details.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              placeholder="e.g., 1234"
              className="input-gold flex-1 text-center tracking-widest"
              value={receiptCode}
              onChange={(e) => setReceiptCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            />
            <button 
              onClick={handleLookup}
              className="bg-[#D6B56A] text-[#0B0B0D] px-4 py-2 rounded-md hover:bg-[#C4A35A] transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
          {lookupError && <p className="text-red-400 text-xs mt-2">{lookupError}</p>}
        </div>

        {/* Scroll Hint */}
        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-[#B8B2AA] mb-2">Scroll to explore</p>
          <ChevronDown className="mx-auto animate-bounce-slow text-[#D6B56A]" size={24} />
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="collection-section py-20 px-6 lg:px-12 bg-[#0B0B0D]">
        <div className="collection-title max-w-7xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The <span className="text-[#D6B56A]">Collection</span>
          </h2>
          <p className="text-[#B8B2AA] text-lg max-w-xl">
            Rings, bracelets, and necklaces—crafted for everyday luxury.
          </p>
        </div>

        <div className="products-grid max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-card group bg-[#141419] rounded-xl overflow-hidden border border-white/5 hover:border-[#D6B56A]/30 transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-[#F4F1EA] mb-1">{product.name}</h3>
                  <p className="text-[#D6B56A] font-semibold">{product.price}</p>
                </div>
                <button className="btn-gold py-2 px-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craft Section */}
      <section ref={craftRef} id="craft" className="relative h-screen w-full overflow-hidden">
        <div className="craft-bg absolute inset-0">
          <img 
            src="/images/craft_ring.jpg" 
            alt="Gold Ring Craft" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0B0B0D]/55" />
        </div>

        <div className="relative z-10 h-full flex items-center px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="craft-title text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              CRAFTED TO <span className="text-[#D6B56A]">LAST.</span>
            </h2>
            <div className="space-y-4">
              <div className="craft-point flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D6B56A]" />
                <p className="text-lg text-[#F4F1EA]">Certified purity with every piece.</p>
              </div>
              <div className="craft-point flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D6B56A]" />
                <p className="text-lg text-[#F4F1EA]">Hand-finished by master jewellers.</p>
              </div>
              <div className="craft-point flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D6B56A]" />
                <p className="text-lg text-[#F4F1EA]">Ethically sourced gold.</p>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('contact')}
              className="craft-point btn-gold mt-8"
            >
              Read Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Featured Set Section */}
      <section ref={featuredRef} className="relative h-screen w-full overflow-hidden">
        <div className="featured-bg absolute inset-0">
          <img 
            src="/images/featured_set.jpg" 
            alt="Featured Set" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0B0B0D]/45" />
        </div>

        <div className="relative z-10 h-full flex items-center px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="featured-title text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              COMPLETE THE <span className="text-[#D6B56A]">LOOK.</span>
            </h2>
            <p className="featured-subtitle text-xl text-[#B8B2AA] mb-8 max-w-lg">
              A bracelet and ring pairing designed to be worn together—understated, confident, timeless.
            </p>
            <button 
              onClick={() => scrollToSection('collection')}
              className="featured-cta btn-gold-filled"
            >
              Shop This Look
            </button>
          </div>
        </div>
      </section>

      {/* Receipt Lookup Section */}
      <section ref={lookupRef} id="lookup" className="py-20 px-6 lg:px-12 bg-[#141419]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="lookup-title">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Verify Your <span className="text-[#D6B56A]">Purchase</span>
            </h2>
            <p className="text-[#B8B2AA] text-lg mb-8 leading-relaxed">
              If you've misplaced your receipt, enter the 4-digit code we provided at the time of purchase. 
              We'll retrieve your item details, date, and warranty info instantly.
            </p>
            <div className="flex items-center gap-4 text-[#B8B2AA]">
              <ShoppingBag className="text-[#D6B56A]" size={24} />
              <span>Secure & Instant Lookup</span>
            </div>
            <div className="flex items-center gap-4 text-[#B8B2AA] mt-4">
              <Award className="text-[#D6B56A]" size={24} />
              <span>Warranty Status Included</span>
            </div>
          </div>

          <div className="lookup-form-card bg-white/5 border border-[#D6B56A]/30 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleLookup}>
              <label className="block text-sm text-[#B8B2AA] mb-3 uppercase tracking-wider">
                4-digit receipt code
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g., 1234"
                  className="input-gold flex-1 text-center text-2xl tracking-[0.5em] font-semibold"
                  value={receiptCode}
                  onChange={(e) => {
                    setReceiptCode(e.target.value.replace(/\D/g, '').slice(0, 4))
                    setLookupError('')
                  }}
                />
              </div>
              {lookupError && (
                <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                  <X size={16} /> {lookupError}
                </p>
              )}
              <button 
                type="submit"
                className="w-full btn-gold-filled py-4 text-lg font-medium"
              >
                View Purchase Details
              </button>
            </form>
            <a 
              href="https://wa.me/923407435372"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[#B8B2AA] text-sm mt-6 hover:text-[#D6B56A] transition-colors"
            >
              Need help? Contact us on WhatsApp.
            </a>
          </div>
        </div>
      </section>

      {/* About / Contact Section */}
      <section id="contact" className="about-section py-20 px-6 lg:px-12 bg-[#0B0B0D]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="about-title text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Al <span className="text-[#D6B56A]">Hafiz</span> Jewellers
            </h2>
            <p className="about-story text-[#B8B2AA] text-lg leading-relaxed mb-8">
              For over two decades, we've specialized in gold jewellery that balances tradition with modern design. 
              Every piece is checked for purity, finished by hand, and sold with a promise: if you ever lose your receipt, 
              your code keeps your record safe.
            </p>
            <div className="flex items-center gap-3 text-[#D6B56A]">
              <Heart size={20} />
              <span className="text-sm">Trusted by thousands of customers</span>
            </div>
          </div>

          <div className="contact-card bg-[#141419] border border-[#D6B56A]/20 rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Get in Touch
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D6B56A]/10 flex items-center justify-center">
                  <Phone className="text-[#D6B56A]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-[#B8B2AA]">Call</p>
                  <p className="text-[#F4F1EA]">+92 340 7435372</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D6B56A]/10 flex items-center justify-center">
                  <MessageCircle className="text-[#D6B56A]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-[#B8B2AA]">WhatsApp</p>
                  <p className="text-[#F4F1EA]">+92 340 7435372</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D6B56A]/10 flex items-center justify-center">
                  <MapPin className="text-[#D6B56A]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-[#B8B2AA]">Visit</p>
                  <p className="text-[#F4F1EA]">Pakistan</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D6B56A]/10 flex items-center justify-center">
                  <Clock className="text-[#D6B56A]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-[#B8B2AA]">Hours</p>
                  <p className="text-[#F4F1EA]">Mon–Sat, 11:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/923407435372"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-filled w-full mt-8 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-12 px-6 lg:px-12 bg-[#0B0B0D] border-t border-white/5">
        <div className="footer-content max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Al <span className="text-[#D6B56A]">Hafiz</span>
              </div>
              <p className="text-[#B8B2AA] text-sm">Timeless Gold. Modern Craft.</p>
            </div>
            
            <div className="flex gap-8">
              <button onClick={() => scrollToSection('collection')} className="text-[#B8B2AA] hover:text-[#D6B56A] transition-colors text-sm">Collection</button>
              <button onClick={() => scrollToSection('lookup')} className="text-[#B8B2AA] hover:text-[#D6B56A] transition-colors text-sm">Verify Purchase</button>
              <button onClick={() => scrollToSection('contact')} className="text-[#B8B2AA] hover:text-[#D6B56A] transition-colors text-sm">Contact</button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[#B8B2AA]/60 text-sm">
              © 2026 Al Hafiz Jewellers. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Receipt Modal */}
      {showModal && receiptData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#141419] border border-[#D6B56A]/30 rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Purchase <span className="text-[#D6B56A]">Details</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#B8B2AA] hover:text-[#F4F1EA] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-[#B8B2AA]">Item</span>
                <span className="text-[#F4F1EA] font-medium">{receiptData.itemName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-[#B8B2AA]">Purchase Date</span>
                <span className="text-[#F4F1EA] font-medium">{receiptData.purchaseDate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-[#B8B2AA]">Purity</span>
                <span className="text-[#D6B56A] font-medium">{receiptData.purity}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-[#B8B2AA]">Net Weight</span>
                <span className="text-[#F4F1EA] font-medium">{receiptData.netWeight}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span className="text-[#B8B2AA]">Price</span>
                <span className="text-[#F4F1EA] font-medium">{receiptData.price}</span>
              </div>
              {receiptData.customerName && (
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-[#B8B2AA]">Customer</span>
                  <span className="text-[#F4F1EA] font-medium">{receiptData.customerName}</span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="text-[#B8B2AA]">Warranty</span>
                <span className="text-green-400 font-medium">{receiptData.warrantyStatus}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="btn-gold-filled w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App