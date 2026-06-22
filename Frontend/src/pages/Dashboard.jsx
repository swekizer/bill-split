import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState({});
  const navigate = useNavigate();
  const { user, logout, getAuthHeader, API_URL } = useAuth();

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/bills`, {
        headers: getAuthHeader(),
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by generatedAt descending (newest first)
        const sorted = data.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
        setBills(sorted);
      } else {
        setError("Failed to load bills. Please refresh.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = (urlUuid, e) => {
    e.stopPropagation(); // Prevent card click navigation
    const shareUrl = `${window.location.origin}/bill/${urlUuid}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(prev => ({ ...prev, [urlUuid]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [urlUuid]: false }));
      }, 2000);
    });
  };

  // Filter bills by title
  const filteredBills = bills.filter(bill =>
    bill.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden font-sans">
      {/* SideNavBar (Desktop) */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/20 p-gutter z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white">account_balance_wallet</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-headline-md text-primary">Bill Split</h1>
            <p className="font-body-md text-xs text-on-surface-variant">Manage shared bills</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <a className="flex items-center gap-3 bg-primary-container text-white rounded-xl px-4 py-3 transition-all duration-150" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-body-md text-body-md font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high/50 rounded-xl px-4 py-3 transition-all duration-200" href="#" onClick={() => navigate("/dashboard")}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-body-md text-body-md">Active Bills</span>
          </a>
        </nav>
        <div className="mt-auto space-y-2 pt-6 border-t border-outline-variant/10">
          <button 
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-4 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            onClick={() => navigate("/create")}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Upload Receipt
          </button>
          <a className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high/50 rounded-xl px-4 py-3 transition-all duration-200" href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
            <span className="material-symbols-outlined text-error">logout</span>
            <span className="font-body-md text-body-md font-semibold text-error">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-container-padding py-4 sticky top-0 z-50 bg-white shadow-sm border-b border-surface-container-high">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-full text-sm w-full focus:outline-none focus:border-primary focus:bg-white transition-all outline-none" 
                placeholder="Search bills..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden md:inline text-on-surface-variant">Hello, {user?.email}</span>
            <div className="h-9 w-9 rounded-full bg-primary-container text-white font-bold flex items-center justify-center border border-primary/20 select-none">
              {user?.email ? user.email[0].toUpperCase() : "U"}
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-container-padding space-y-stack-lg pb-32">
          {/* Header Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl text-on-background">My Bills</h2>
              <p className="text-on-surface-variant text-sm mt-1">View your scanned receipts and split details.</p>
            </div>
            <button 
              className="bg-primary text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md lg:hidden"
              onClick={() => navigate("/create")}
            >
              <span className="material-symbols-outlined">add</span>
              New Bill
            </button>
          </div>

          {error && (
            <div className="p-4 bg-error-container/20 border border-error/20 text-error text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Active Bills Section */}
          <section className="space-y-stack-md">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <p className="text-on-surface-variant text-sm font-medium">Fetching bills...</p>
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="bg-white border border-dashed border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-10 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-outline-variant opacity-60 mb-4">receipt_long</span>
                <h3 className="font-display font-semibold text-xl mb-2">No bills found</h3>
                <p className="text-on-surface-variant text-sm mb-6">
                  {searchQuery ? "No bills match your search query." : "Scan your first receipt using AI to split expenses instantly."}
                </p>
                {!searchQuery && (
                  <button 
                    className="bg-primary text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:opacity-95 cursor-pointer active:scale-95 transition-all"
                    onClick={() => navigate("/create")}
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    Create First Bill
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-base">
                {filteredBills.map((bill) => {
                  const billTotal = bill.billItems 
                    ? bill.billItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    : 0;
                  const dateFormatted = new Date(bill.generatedAt).toLocaleDateString(undefined, {
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  }) + " • " + new Date(bill.generatedAt).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={bill.billId} 
                      className="bg-white p-5 rounded-xl border border-surface-container-high hover:border-primary transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                      onClick={() => navigate(`/bill/${bill.url}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
                          {bill.billImage ? (
                            <img className="w-full h-full object-cover" src={bill.billImage} alt={bill.title} />
                          ) : (
                            <span className="material-symbols-outlined text-outline text-2xl">receipt</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-lg text-on-surface group-hover:text-primary transition-colors">{bill.title}</h4>
                          <p className="text-on-surface-variant text-xs mt-1">{dateFormatted}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="font-bold text-on-surface text-lg">₹{billTotal.toFixed(2)}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{bill.billItems?.length || 0} items</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-slate-100 hover:bg-primary/10 hover:text-primary p-2.5 rounded-xl transition-all cursor-pointer relative"
                            onClick={(e) => handleCopyLink(bill.url, e)}
                            title="Copy split link"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {copySuccess[bill.url] ? "check" : "share"}
                            </span>
                            {copySuccess[bill.url] && (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
                                Copied!
                              </span>
                            )}
                          </button>
                          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                            chevron_right
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Floating Action Button (Mobile Contextual) */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform active:scale-95 group z-50 cursor-pointer lg:hidden"
        onClick={() => navigate("/create")}
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}

export default Dashboard;