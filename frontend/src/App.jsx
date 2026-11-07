
import { useEffect, useState } from "react";
import {
  Compass, LayoutDashboard, Map, Wallet, Users,
  Bell, Plus, MapPin, CalendarDays, ArrowUpRight,
  Plane, Mountain, Heart, Menu, X, TrendingUp,
  Globe, Trash2, Bot, Send, Sparkles, MessageCircle,
  Clock, ShieldCheck
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000";

const initialDestinations = [
  {
    name: "Bali",
    country: "Indonesia",
    price: "₹28,000",
    days: "5 days",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900"
  },
  {
    name: "Manali",
    country: "India",
    price: "₹12,000",
    days: "4 days",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900"
  },
  {
    name: "Switzerland",
    country: "Europe",
    price: "₹85,000",
    days: "7 days",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900"
  }
];

const quickQuestions = [
  "Suggest a trip under ₹15000",
  "Best destinations in India",
  "How can I save money while travelling?",
  "Create a 5-day itinerary"
];

function App() {
  const [page, setPage] = useState("Overview");
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [message, setMessage] = useState("");

  const [tripForm, setTripForm] = useState({
    destination: "",
    country: "India",
    start_date: "",
    end_date: "",
    budget: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Transport",
    amount: "",
    expense_date: ""
  });

  const [postForm, setPostForm] = useState({
    author: "Traveller",
    location: "",
    content: ""
  });

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text: "Hello, traveller! I'm your TRAVORA travel assistant. Tell me your budget, destination or travel plans, and I'll help you explore ideas."
    }
  ]);

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }

  async function loadData() {
    try {
      const [t, e, p, d] = await Promise.all([
        request("/api/trips"),
        request("/api/expenses"),
        request("/api/posts"),
        request("/api/dashboard")
      ]);

      setTrips(t);
      setExpenses(e);
      setPosts(p);
      setDashboard(d);
      setMessage("");
    } catch (error) {
      setMessage("Backend connection unavailable. Start the FastAPI server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addTrip(event) {
    event.preventDefault();

    try {
      await request("/api/trips", {
        method: "POST",
        body: JSON.stringify({
          ...tripForm,
          budget: Number(tripForm.budget || 0)
        })
      });

      setTripForm({
        destination: "",
        country: "India",
        start_date: "",
        end_date: "",
        budget: ""
      });

      setShowTripForm(false);
      await loadData();
    } catch {
      setMessage("Unable to save trip. Check your backend.");
    }
  }

  async function addExpense(event) {
    event.preventDefault();

    try {
      await request("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          ...expenseForm,
          amount: Number(expenseForm.amount)
        })
      });

      setExpenseForm({
        title: "",
        category: "Transport",
        amount: "",
        expense_date: ""
      });

      setShowExpenseForm(false);
      await loadData();
    } catch {
      setMessage("Unable to save expense.");
    }
  }

  async function addPost(event) {
    event.preventDefault();

    try {
      await request("/api/posts", {
        method: "POST",
        body: JSON.stringify(postForm)
      });

      setPostForm({
        author: "Traveller",
        location: "",
        content: ""
      });

      await loadData();
    } catch {
      setMessage("Unable to publish your post.");
    }
  }

  async function deleteTrip(id) {
    try {
      await request(`/api/trips/${id}`, { method: "DELETE" });
      await loadData();
    } catch {
      setMessage("Unable to delete trip.");
    }
  }

  async function likePost(id) {
    try {
      await request(`/api/posts/${id}/like`, { method: "POST" });
      await loadData();
    } catch {
      setMessage("Unable to like post.");
    }
  }

  // Smart travel assistant: initial rule-based recommendation engine.
  function generateTravelReply(question) {
    const q = question.toLowerCase();

    const budgetMatch = q.match(/(?:under|below|within|budget of|budget)\s*₹?\s*(\d+)/);
    const budgetLimit = budgetMatch ? Number(budgetMatch[1]) : null;

    if (q.includes("save money") || q.includes("saving") || q.includes("cheap")) {
      return `Here are 6 practical ways to save money while travelling:

1. Book transport and accommodation early.
2. Travel during off-season.
3. Compare hotels with hostels and homestays.
4. Use public transport instead of taxis.
5. Eat at local restaurants.
6. Keep a daily spending limit.

TRAVORA tip: Record every expense in your Budget section so you can track your remaining money.`;
    }

    if (q.includes("itinerary") || q.includes("day plan") || q.includes("travel plan")) {
      const destination =
        q.includes("goa") ? "Goa" :
        q.includes("manali") ? "Manali" :
        q.includes("bali") ? "Bali" :
        q.includes("mysore") ? "Mysore" :
        q.includes("coorg") ? "Coorg" : "your chosen destination";

      return `Suggested 5-day ${destination} itinerary:

Day 1: Arrival, hotel check-in and local exploration.
Day 2: Visit the main attractions and landmarks.
Day 3: Explore nature, viewpoints and outdoor activities.
Day 4: Experience local food, culture and shopping.
Day 5: Relax, take photographs and return.

Remember to check opening hours, travel distances and local conditions before visiting.`;
    }

    if (q.includes("india") || q.includes("destination") || q.includes("places")) {
      return `Here are some destinations worth exploring:

• Manali – Mountains, adventure and scenic views.
• Goa – Beaches, food and coastal experiences.
• Coorg – Coffee plantations and nature.
• Mysore – Heritage, palaces and culture.
• Jaipur – Architecture, forts and history.
• Munnar – Tea gardens and beautiful landscapes.

Choose based on your budget, season and preferred activities.`;
    }

    if (q.includes("bali")) {
      return "Bali, Indonesia is popular for beaches, temples and nature. A sample 5-day plan could include Ubud, rice terraces, beach visits, local markets and cultural experiences. Remember to check flights, visa requirements and accommodation costs before booking.";
    }

    if (q.includes("manali")) {
      return "Manali is a great mountain destination. You can explore Old Manali, Hadimba Temple, Solang Valley and nearby viewpoints. A 4-day trip is a useful starting point. Check weather and road conditions before travelling.";
    }

    if (q.includes("goa")) {
      return "Goa is excellent for beaches, local food and coastal exploration. Consider North Goa for lively beaches and South Goa for a quieter experience. Plan transport and accommodation before your trip.";
    }

    if (budgetLimit !== null) {
      let recommendations = [
        "Manali – mountain and nature experience",
        "Mysore – heritage and city exploration",
        "Coorg – nature and coffee plantations"
      ];

      if (budgetLimit < 5000) {
        recommendations = [
          "Nearby weekend destinations",
          "Local nature and heritage attractions",
          "One-day city exploration"
        ];
      } else if (budgetLimit >= 20000) {
        recommendations.push("Goa – beach holiday");
      }

      return `For a budget of ₹${budgetLimit.toLocaleString("en-IN")}, consider these ideas:

${recommendations.map((item, i) => `${i + 1}. ${item}`).join("\n")}

Suggested budget allocation:
• Transport: 30%
• Accommodation: 30%
• Food: 20%
• Activities: 10%
• Emergency reserve: 10%

These are planning suggestions, not live prices. Compare current costs before booking.`;
    }

    return `I can help you with:

• Destination recommendations
• Budget-friendly travel ideas
• 5-day or 7-day itineraries
• Travel budget allocation
• Money-saving tips
• Indian tourist destinations

Try asking: "Suggest a trip under ₹15000" or "Create a 5-day itinerary for Manali".`;
  }

  function sendAssistantMessage(event) {
    event.preventDefault();

    const question = assistantInput.trim();
    if (!question) return;

    const reply = generateTravelReply(question);

    setAssistantMessages(previous => [
      ...previous,
      { role: "user", text: question },
      { role: "assistant", text: reply }
    ]);

    setAssistantInput("");
  }

  function askQuickQuestion(question) {
    const reply = generateTravelReply(question);

    setAssistantMessages(previous => [
      ...previous,
      { role: "user", text: question },
      { role: "assistant", text: reply }
    ]);
  }

  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "My Trips", icon: Map },
    { name: "Budget", icon: Wallet },
    { name: "Travel Assistant", icon: Bot },
    { name: "Community", icon: Users }
  ];

  const spent = Number(dashboard.total_spent || 0);
  const budget = Number(dashboard.total_budget || 0);
  const remaining = Number(dashboard.remaining_budget || 0);

  const progress = budget > 0
    ? Math.min((spent / budget) * 100, 100)
    : 0;

  function changePage(name) {
    setPage(name);
    setMobileMenu(false);
  }

  function Sidebar() {
    return (
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Compass size={24} /></div>
          <div>
            <h2>travora<span>.</span></h2>
            <small>YOUR JOURNEY STARTS HERE</small>
          </div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <X />
          </button>
        </div>

        <p className="nav-label">MENU</p>

        <nav>
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? "active" : ""}`}
                onClick={() => changePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {page === item.name && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="travel-tip">
            <Globe size={23} />
            <h3>Life is a journey.</h3>
            <p>Make every destination a beautiful memory.</p>
          </div>

          <div className="profile">
            <div className="avatar">T</div>
            <div>
              <strong>Traveller</strong>
              <small>Explorer account</small>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  function Header() {
    return (
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileMenu(true)}>
          <Menu />
        </button>

        <div>
          <p className="date-label">YOUR PERSONAL TRAVEL SPACE</p>
          <h1>{page}</h1>
        </div>

        <div className="header-actions">
          <button className="icon-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <div className="header-avatar">T</div>
        </div>
      </header>
    );
  }

  function TripCards() {
    return (
      <div className="trip-list">
        {trips.length === 0 ? (
          <div className="empty-state">
            <MapPin size={32} />
            <h3>No trips planned yet</h3>
            <p>Your next adventure is waiting to be created.</p>
            <button className="primary-button" onClick={() => setShowTripForm(true)}>
              <Plus size={17} /> Plan a trip
            </button>
          </div>
        ) : (
          trips.map(trip => (
            <article className="trip-row" key={trip.id}>
              <div className="trip-icon"><MapPin /></div>

              <div className="trip-info">
                <h3>{trip.destination}</h3>
                <p>{trip.country} · {trip.status}</p>
                <small>
                  {trip.start_date || "Date not set"}
                  {trip.end_date ? ` — ${trip.end_date}` : ""}
                </small>
              </div>

              <strong>₹{Number(trip.budget).toLocaleString("en-IN")}</strong>

              <button
                className="delete-button"
                onClick={() => deleteTrip(trip.id)}
                aria-label="Delete trip"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))
        )}
      </div>
    );
  }

  function Overview() {
    return (
      <>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">
              <Compass size={14} /> EXPLORE THE WORLD
            </span>

            <h2>Collect moments,<br />not just destinations.</h2>

            <p>
              Discover new places, organize your adventures and travel within your budget.
            </p>

            <button className="hero-button" onClick={() => setShowTripForm(true)}>
              Start planning <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="hero-art">
            <Mountain size={155} strokeWidth={0.8} />
            <Plane size={38} className="plane-icon" />
          </div>
        </section>

        {message && <div className="notice">{message}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green"><MapPin /></div>
            <p>MY TRIPS</p>
            <h2>{dashboard.total_trips || 0}</h2>
            <small>Planned adventures</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange"><Wallet /></div>
            <p>TOTAL BUDGET</p>
            <h2>₹{budget.toLocaleString("en-IN")}</h2>
            <small>Across all trips</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><TrendingUp /></div>
            <p>TOTAL SPENT</p>
            <h2>₹{spent.toLocaleString("en-IN")}</h2>
            <small>Recorded expenses</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple"><Users /></div>
            <p>COMMUNITY</p>
            <h2>{dashboard.community_posts || 0}</h2>
            <small>Shared stories</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel main-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR ADVENTURES</span>
                <h2>Recent trips</h2>
              </div>

              <button className="text-button" onClick={() => setPage("My Trips")}>
                View all <ArrowUpRight size={16} />
              </button>
            </div>

            <TripCards />
          </div>

          <div className="panel budget-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FINANCIAL OVERVIEW</span>
                <h2>Travel budget</h2>
              </div>
              <Wallet size={21} />
            </div>

            <div className="budget-number">
              <span>₹{remaining.toLocaleString("en-IN")}</span>
              <small>Remaining</small>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="budget-labels">
              <span>Spent ₹{spent.toLocaleString("en-IN")}</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <button className="outline-button" onClick={() => setPage("Budget")}>
              View budget details
            </button>
          </div>
        </section>

        <section className="panel destinations-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR NEXT ESCAPE</span>
              <h2>Popular destinations</h2>
            </div>
            <Globe size={23} />
          </div>

          <div className="destination-grid">
            {initialDestinations.map(place => (
              <article className="destination-card" key={place.name}>
                <img src={place.image} alt={place.name} />

                <div className="destination-info">
                  <div>
                    <h3>{place.name}</h3>
                    <p><MapPin size={13} /> {place.country}</p>
                  </div>

                  <strong>{place.price}</strong>
                  <small><CalendarDays size={13} /> {place.days}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel assistant-promo">
          <div className="assistant-promo-icon"><Sparkles size={25} /></div>
          <div>
            <span className="eyebrow">YOUR SMART TRAVEL COMPANION</span>
            <h2>Need help planning your next adventure?</h2>
            <p>Explore destinations, get itinerary ideas and plan your travel budget.</p>
          </div>
          <button className="primary-button" onClick={() => setPage("Travel Assistant")}>
            Ask TRAVORA <ArrowUpRight size={16} />
          </button>
        </section>
      </>
    );
  }

  function TripsPage() {
    return (
      <section className="panel page-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR TRAVEL COLLECTION</span>
            <h2>All my trips</h2>
          </div>

          <button className="primary-button" onClick={() => setShowTripForm(true)}>
            <Plus size={17} /> New trip
          </button>
        </div>

        <TripCards />
      </section>
    );
  }

  function BudgetPage() {
    return (
      <section className="budget-page">
        <div className="stats-grid">
          <div className="stat-card">
            <p>TOTAL BUDGET</p>
            <h2>₹{budget.toLocaleString("en-IN")}</h2>
          </div>

          <div className="stat-card">
            <p>TOTAL SPENT</p>
            <h2>₹{spent.toLocaleString("en-IN")}</h2>
          </div>

          <div className="stat-card">
            <p>REMAINING</p>
            <h2>₹{remaining.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SPENDING CONTROL</span>
              <h2>Budget progress</h2>
            </div>
          </div>

          <div className="progress-track large">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <p>{Math.round(progress)}% of your total travel budget has been spent.</p>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR TRANSACTIONS</span>
              <h2>Expenses</h2>
            </div>

            <button className="primary-button" onClick={() => setShowExpenseForm(true)}>
              <Plus size={17} /> Add expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <p className="muted">No expenses recorded yet.</p>
          ) : (
            expenses.map(expense => (
              <div className="expense-row" key={expense.id}>
                <div className="expense-icon"><Wallet size={18} /></div>

                <div>
                  <strong>{expense.title}</strong>
                  <small>{expense.category} · {expense.expense_date || "Date not set"}</small>
                </div>

                <strong>₹{Number(expense.amount).toLocaleString("en-IN")}</strong>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }

  function AssistantPage() {
    return (
      <section className="assistant-page">
        <div className="assistant-welcome panel">
          <div className="assistant-welcome-icon">
            <Bot size={32} />
          </div>

          <span className="eyebrow">TRAVORA INTELLIGENCE</span>
          <h2>Your personal travel assistant</h2>
          <p>
            Get destination ideas, budget guidance and itinerary suggestions
            to help plan your next journey.
          </p>
          <div className="assistant-status">
            <span /> Smart travel assistant available
          </div>
        </div>

        <div className="panel assistant-chat">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRAVEL CONVERSATION</span>
              <h2><MessageCircle size={19} /> Ask TRAVORA</h2>
            </div>
            <Sparkles size={21} />
          </div>

          <div className="quick-questions">
            <p>TRY ASKING</p>
            <div>
              {quickQuestions.map(question => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-messages">
            {assistantMessages.map((item, index) => (
              <div
                className={`chat-message ${item.role === "user" ? "user-message" : "assistant-message"}`}
                key={index}
              >
                <div className="chat-message-icon">
                  {item.role === "user" ? <Users size={17} /> : <Bot size={18} />}
                </div>

                <div className="chat-message-content">
                  <strong>{item.role === "user" ? "You" : "TRAVORA Assistant"}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="assistant-input-area" onSubmit={sendAssistantMessage}>
            <input
              value={assistantInput}
              onChange={event => setAssistantInput(event.target.value)}
              placeholder="Ask about destinations, budgets or itineraries..."
              aria-label="Ask the travel assistant"
            />

            <button type="submit" aria-label="Send message" disabled={!assistantInput.trim()}>
              <Send size={18} />
            </button>
          </form>

          <p className="assistant-disclaimer">
            <ShieldCheck size={13} />
            Suggestions are generated by built-in rules. Verify travel prices,
            local conditions and booking details independently.
          </p>
        </div>

        <div className="assistant-feature-grid">
          <div className="panel">
            <MapPin size={23} />
            <h3>Destination discovery</h3>
            <p>Explore travel destinations based on your interests and budget.</p>
          </div>

          <div className="panel">
            <Wallet size={23} />
            <h3>Budget guidance</h3>
            <p>Get a suggested breakdown of your travel spending.</p>
          </div>

          <div className="panel">
            <Clock size={23} />
            <h3>Itinerary ideas</h3>
            <p>Get a simple day-by-day travel plan for your destination.</p>
          </div>
        </div>
      </section>
    );
  }

  function CommunityPage() {
    return (
      <div className="community-layout">
        <section className="panel">
          <span className="eyebrow">TRAVELLER COMMUNITY</span>
          <h2>Share your journey</h2>

          <form className="form-stack" onSubmit={addPost}>
            <input
              placeholder="Your name"
              value={postForm.author}
              onChange={e => setPostForm({ ...postForm, author: e.target.value })}
              required
            />

            <input
              placeholder="Where did you travel?"
              value={postForm.location}
              onChange={e => setPostForm({ ...postForm, location: e.target.value })}
              required
            />

            <textarea
              placeholder="Tell the community about your experience..."
              value={postForm.content}
              onChange={e => setPostForm({ ...postForm, content: e.target.value })}
              required
            />

            <button className="primary-button" type="submit">
              Publish story <ArrowUpRight size={17} />
            </button>
          </form>
        </section>

        <section className="panel">
          <span className="eyebrow">TRAVEL STORIES</span>
          <h2>Community feed</h2>

          {posts.length === 0 ? (
            <p className="muted">Be the first to share a travel story!</p>
          ) : (
            posts.map(post => (
              <article className="post-card" key={post.id}>
                <div className="post-avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>

                <div className="post-content">
                  <strong>{post.author}</strong>
                  <small><MapPin size={12} /> {post.location}</small>
                  <p>{post.content}</p>

                  <button className="like-button" onClick={() => likePost(post.id)}>
                    <Heart size={16} /> {post.likes} Likes
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Compass size={38} />
        <h2>TRAVORA</h2>
        <p>Preparing your next journey...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />

      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      <main className="main-content">
        <Header />

        <div className="page-content">
          {page === "Overview" && <Overview />}
          {page === "My Trips" && <TripsPage />}
          {page === "Budget" && <BudgetPage />}
          {page === "Travel Assistant" && <AssistantPage />}
          {page === "Community" && <CommunityPage />}
        </div>

        <footer className="footer">
          © 2026 TRAVORA · Explore more. Plan better. Travel together.
        </footer>
      </main>

      {showTripForm && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={addTrip}>
            <div className="modal-heading">
              <h2>Plan a new trip</h2>
              <button type="button" onClick={() => setShowTripForm(false)}>
                <X />
              </button>
            </div>

            <label>
              Destination
              <input
                required
                placeholder="e.g. Goa"
                value={tripForm.destination}
                onChange={e => setTripForm({ ...tripForm, destination: e.target.value })}
              />
            </label>

            <label>
              Country
              <input
                required
                value={tripForm.country}
                onChange={e => setTripForm({ ...tripForm, country: e.target.value })}
              />
            </label>

            <div className="two-inputs">
              <label>
                Start date
                <input
                  type="date"
                  value={tripForm.start_date}
                  onChange={e => setTripForm({ ...tripForm, start_date: e.target.value })}
                />
              </label>

              <label>
                End date
                <input
                  type="date"
                  value={tripForm.end_date}
                  onChange={e => setTripForm({ ...tripForm, end_date: e.target.value })}
                />
              </label>
            </div>

            <label>
              Budget (₹)
              <input
                type="number"
                min="0"
                required
                placeholder="15000"
                value={tripForm.budget}
                onChange={e => setTripForm({ ...tripForm, budget: e.target.value })}
              />
            </label>

            <button className="primary-button full-button" type="submit">
              Save trip
            </button>
          </form>
        </div>
      )}

      {showExpenseForm && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={addExpense}>
            <div className="modal-heading">
              <h2>Add expense</h2>
              <button type="button" onClick={() => setShowExpenseForm(false)}>
                <X />
              </button>
            </div>

            <label>
              Expense name
              <input
                required
                placeholder="e.g. Hotel booking"
                value={expenseForm.title}
                onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
              />
            </label>

            <label>
              Category
              <select
                value={expenseForm.category}
                onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
              >
                <option>Transport</option>
                <option>Food</option>
                <option>Stay</option>
                <option>Shopping</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Amount (₹)
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={expenseForm.expense_date}
                onChange={e => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
              />
            </label>

            <button className="primary-button full-button" type="submit">
              Save expense
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
