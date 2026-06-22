import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BillSplit() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { user, login, register, getAuthHeader, API_URL } = useAuth();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({}); // tracks name -> { ...item, quantity }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);

  // Quick auth modal state for guests trying to pay
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // 'login' or 'register'
  const [username, setUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUpiId, setAuthUpiId] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    fetchBillItems();
  }, [uuid]);

  async function fetchBillItems() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/bill/${uuid}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        setError("Could not find this bill. Check the link and try again.");
      }
    } catch (err) {
      setError("Network error loading bill details.");
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(idx, item) {
    setSelected((prev) => {
      if (prev[idx]) {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      } else {
        return { ...prev, [idx]: { ...item, quantity: 1 } };
      }
    });
  }

  function changeQty(idx, item, qty) {
    const numericQty = Math.max(1, Math.min(item.quantity, Number(qty)));
    setSelected((prev) => ({
      ...prev,
      [idx]: { ...item, quantity: numericQty },
    }));
  }

  async function executeSave(currentUser) {
    setSubmitting(true);
    setError("");
    const selectedItems = Object.values(selected);

    try {
      const credentials = currentUser ? currentUser.credentials : user.credentials;
      const response = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + credentials,
        },
        body: JSON.stringify({
          billUrl: uuid,
          selectedItems: selectedItems,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPayment(result); // { totalAmount, upiLink }
        setShowAuthDrawer(false);
      } else {
        const text = await response.text();
        setError(text || "Failed to save selection and calculate payment.");
      }
    } catch (err) {
      setError("Network error saving selection.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmAndPay() {
    if (!user) {
      setAuthError("");
      setShowAuthDrawer(true);
      return;
    }
    await executeSave();
  }

  async function handleDrawerAuthSubmit(e) {
    e.preventDefault();
    setAuthError("");
    setSubmitting(true);

    if (authTab === "login") {
      try {
        const result = await login(authEmail, authPassword);
        if (result.success) {
          // Now execute save with newly logged in user credentials
          const credentials = btoa(authEmail + ":" + authPassword);
          await executeSave({ credentials });
        } else {
          setAuthError(result.error || "Authentication failed.");
          setSubmitting(false);
        }
      } catch (err) {
        setAuthError("Failed to log in.");
        setSubmitting(false);
      }
    } else {
      if (!username || !authUpiId) {
        setAuthError("Please fill in all fields.");
        setSubmitting(false);
        return;
      }
      try {
        const regResult = await register(username, authEmail, authPassword, authUpiId);
        if (regResult.success) {
          // Immediately log in
          const logResult = await login(authEmail, authPassword);
          if (logResult.success) {
            const credentials = btoa(authEmail + ":" + authPassword);
            await executeSave({ credentials });
          } else {
            setAuthError("Account created, but auto-login failed. Please sign in manually.");
            setSubmitting(false);
          }
        } else {
          setAuthError(regResult.error || "Registration failed.");
          setSubmitting(false);
        }
      } catch (err) {
        setAuthError("Failed to register.");
        setSubmitting(false);
      }
    }
  }

  const runningTotal = Object.values(selected).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const billGrandTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="bg-background text-on-background min-h-screen selection:bg-primary-container selection:text-on-primary-container font-sans relative pb-40">
      {/* Top AppBar */}
      <header className="bg-white sticky top-0 z-40 shadow-sm flex justify-between items-center w-full px-container-padding py-4 border-b border-surface-container-high">
        <div className="flex items-center gap-base cursor-pointer" onClick={() => navigate("/")}>
          <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
          <span className="text-xl font-display font-bold text-primary">Bill Split</span>
        </div>
        <div className="flex items-center gap-gutter">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant font-medium hidden sm:inline">{user.email}</span>
              <div className="h-8 w-8 rounded-full bg-primary-container text-white font-bold flex items-center justify-center border border-primary/20">
                {user.email[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <button 
              className="text-sm font-semibold text-primary hover:underline cursor-pointer"
              onClick={() => { setAuthTab("login"); setShowAuthDrawer(true); }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-container-padding py-8 space-y-6">
        {error && (
          <div className="p-4 bg-error-container/20 border border-error/20 text-error text-sm rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-on-surface-variant text-sm font-medium">Loading items...</p>
          </div>
        ) : (
          <>
            {/* Receipt Summary Card */}
            <section>
              <div className="glass-card rounded-2xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden bg-white">
                <div className="flex flex-col gap-1">
                  <h1 className="font-display text-2xl font-bold text-on-surface">Bill Receipt</h1>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    ID: {uuid}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-dashed border-slate-200 flex justify-between items-end">
                  <div>
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Total Receipt</p>
                    <p className="text-3xl font-display font-bold text-on-background">₹{billGrandTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Items count</p>
                    <p className="text-lg font-medium text-slate-800">{items.length} Parsed</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Instruction Header */}
            <div className="flex justify-between items-center pt-2">
              <h2 className="font-display font-bold text-xl text-on-surface">Claim your items</h2>
              <div className="flex items-center gap-1 text-label-md text-primary bg-primary/10 px-3 py-1 rounded-full font-semibold">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Tap to claim
              </div>
            </div>

            {/* Bill Items List */}
            <div className="space-y-3">
              {items.map((item, idx) => {
                const isSelected = !!selected[idx];
                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm hover:border-primary-container cursor-pointer transition-all ${
                      isSelected ? "border-primary-container bg-primary/5" : "border-slate-100"
                    }`}
                    onClick={() => toggleItem(idx, item)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary text-white" : "bg-slate-100 text-primary"
                      }`}>
                        <span className="material-symbols-outlined">restaurant</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-md">{item.name}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Qty: {item.quantity} • ₹{item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      {isSelected && item.quantity > 1 && (
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                          <label className="text-xs font-bold text-slate-600 px-1">Qty:</label>
                          <input 
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={selected[idx].quantity}
                            onChange={(e) => changeQty(idx, item, e.target.value)}
                            className="w-12 bg-white text-center border border-slate-200 rounded text-sm font-semibold p-0.5 outline-none focus:border-primary"
                          />
                        </div>
                      )}
                      <div 
                        className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                          isSelected ? "bg-primary border-primary" : "border-slate-300"
                        }`}
                        onClick={() => toggleItem(idx, item)}
                      >
                        <span className="material-symbols-outlined text-white text-[18px] font-bold">
                          {isSelected ? "check" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Payment Success Details */}
        {payment && (
          <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-lg mt-8 space-y-6 animate-fade-in">
            <div className="p-4 bg-slate-50 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-outline">You Claimed Total</p>
                <p className="text-3xl font-display font-bold text-primary mt-1">₹{payment.totalAmount.toFixed(2)}</p>
              </div>
              
              {/* QR Code generator using a free public API */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payment.upiLink)}`}
                    alt="Scan to Pay QR"
                    className="w-32 h-32"
                  />
                </div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Scan QR to pay</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Launch UPI application to settle:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a 
                  href={payment.upiLink.replace("upi://", "gpay://")}
                  className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center text-xs font-bold gap-1.5"
                >
                  <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
                  Google Pay
                </a>
                <a 
                  href={payment.upiLink.replace("upi://", "phonepe://")}
                  className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center text-xs font-bold gap-1.5"
                >
                  <span className="material-symbols-outlined text-secondary text-xl">account_balance</span>
                  PhonePe
                </a>
                <a 
                  href={payment.upiLink.replace("upi://", "paytmmp://")}
                  className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center text-xs font-bold gap-1.5"
                >
                  <span className="material-symbols-outlined text-tertiary text-xl">account_balance</span>
                  Paytm
                </a>
                <a 
                  href={payment.upiLink}
                  className="flex flex-col items-center justify-center p-3 bg-primary text-white border border-primary rounded-xl hover:opacity-95 transition-opacity text-center text-xs font-bold gap-1.5"
                >
                  <span className="material-symbols-outlined text-white text-xl">send_to_mobile</span>
                  Any UPI App
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Footer (Action Area) */}
      {selectedCount > 0 && !payment && (
        <footer className="fixed bottom-0 left-0 right-0 glass-card border-t border-outline-variant/30 shadow-2xl z-40 transition-all duration-300">
          <div className="max-w-3xl mx-auto px-container-padding py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Your Total</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-display font-bold text-on-background">₹{runningTotal.toFixed(2)}</span>
                <span className="text-xs text-on-surface-variant font-medium">({selectedCount} items)</span>
              </div>
            </div>
            <button 
              className="bg-primary hover:bg-primary/95 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleConfirmAndPay}
              disabled={submitting}
            >
              <span>{submitting ? "Processing..." : "Confirm & Pay"}</span>
              {!submitting && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </div>
        </footer>
      )}

      {/* Auth Drawer Modal for Guest Claims */}
      {showAuthDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-gutter">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl space-y-6 relative border border-slate-100 animate-slide-up">
            <button 
              className="absolute right-4 top-4 text-outline hover:text-on-surface cursor-pointer p-1"
              onClick={() => setShowAuthDrawer(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center">
              <h3 className="font-display font-bold text-2xl">Authentication Required</h3>
              <p className="text-xs text-on-surface-variant mt-1">Please sign in or register to claim and split this bill.</p>
            </div>

            {/* Inline Toggle Tabs */}
            <div className="flex border-b border-slate-200">
              <button 
                className={`flex-1 pb-2 font-display font-semibold text-sm ${authTab === "login" ? "text-primary border-b-2 border-primary" : "text-outline"}`}
                onClick={() => setAuthTab("login")}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 pb-2 font-display font-semibold text-sm ${authTab === "register" ? "text-primary border-b-2 border-primary" : "text-outline"}`}
                onClick={() => setAuthTab("register")}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-error-container/20 border border-error/20 text-error text-xs rounded-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleDrawerAuthSubmit} className="space-y-4">
              {authTab === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Email</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                  required
                />
              </div>

              {authTab === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">UPI ID (to split back)</label>
                  <input 
                    type="text" 
                    placeholder="username@upi"
                    value={authUpiId}
                    onChange={(e) => setAuthUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-1.5"
                disabled={submitting}
              >
                <span>{submitting ? "Processing..." : authTab === "login" ? "Sign In & Settle" : "Register & Settle"}</span>
                {!submitting && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillSplit;