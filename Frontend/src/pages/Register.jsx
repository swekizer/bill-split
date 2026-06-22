import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [upiId, setUpiId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password || !upiId) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await register(username, email, password, upiId);
      if (result.success) {
        setSuccess("Registration successful! You can now sign in.");
        // Clear fields
        setUsername("");
        setEmail("");
        setPassword("");
        setUpiId("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error || "Registration failed. Try a different email.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-gutter relative font-sans">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl float-anim"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl float-anim" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[700px] border border-surface-container-high">
        {/* Brand Side (Visible on MD+) */}
        <section className="hidden md:flex flex-col justify-between w-5/12 bg-on-background p-12 text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim text-4xl">account_balance_wallet</span>
              <h1 className="font-display text-headline-md font-bold text-primary-fixed-dim">Bill Split</h1>
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-headline-lg font-bold leading-tight">Effortless expense sharing for modern teams and friends.</h2>
              <p className="font-body-md text-outline-variant opacity-80">Track bills, settle debts, and maintain social harmony with high-trust financial transparency.</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64 shadow-xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent z-10"></div>
            <img 
              className="w-full h-full object-cover" 
              alt="Clean futuristic finance render" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGuXJ25huW-zHzgbRG1dtKENszHT905vVnL6fAjHc5wjuRYfEMYba3CqjgEcCi3fjmpLw7Gi9zJnoyUemSUzcnsYWXqaIe179hCD9kjXX-_7dVpKOSje9h5IlJc7_wiZdjRDlR54lH23kqJY6PRNIhKex3rw3f-hNszbND-q_z6yx-F6msVSt30B13yV6sj7nPEiR2E9TopWy7cqABFgT6Mt3Wc7fyBqGyOj1MT2ioL6lcYUmqAHEQy5VrZPdZttUliZud7J_f-F-e"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-on-background bg-surface-container-high"></div>
                <div className="w-8 h-8 rounded-full border-2 border-on-background bg-primary-container"></div>
                <div className="w-8 h-8 rounded-full border-2 border-on-background bg-secondary-container"></div>
              </div>
              <p className="text-label-sm mt-2 font-medium">Join 10k+ users managing shared ledgers</p>
            </div>
          </div>
        </section>

        {/* Auth Form Side */}
        <section className="flex-1 flex flex-col p-8 md:p-12 bg-white relative justify-center">
          {/* Mobile Brand Logo */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            <span className="font-display text-headline-md font-bold text-primary">Bill Split</span>
          </div>

          <div className="w-full max-w-md mx-auto">
            {/* Toggle Tabs */}
            <div className="flex border-b border-surface-container-high mb-6">
              <button 
                className="flex-1 pb-4 font-display font-semibold text-label-md transition-all duration-200 text-on-surface-variant hover:text-primary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button className="flex-1 pb-4 font-display font-semibold text-label-md transition-all duration-200 tab-active" disabled>
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div>
              <div className="mb-6">
                <h3 className="font-display text-headline-lg font-bold text-on-background mb-1">Create Account</h3>
                <p className="font-body-md text-on-surface-variant">Join thousands of users managing their finances together.</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-error-container/20 border border-error/20 text-error text-sm rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-primary/10 border border-primary/20 text-primary text-sm rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{success}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-stack-sm">
                  <label className="font-display text-label-md text-on-background block ml-1">Username</label>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2.5 input-focus-effect border border-transparent transition-all">
                    <span className="material-symbols-outlined text-outline mr-3">person</span>
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none" 
                      placeholder="John Doe" 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-stack-sm">
                  <label className="font-display text-label-md text-on-background block ml-1">Email Address</label>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2.5 input-focus-effect border border-transparent transition-all">
                    <span className="material-symbols-outlined text-outline mr-3">mail</span>
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none" 
                      placeholder="name@example.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-stack-sm">
                  <label className="font-display text-label-md text-on-background block ml-1">UPI ID (For payments)</label>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2.5 input-focus-effect border border-transparent transition-all">
                    <span className="material-symbols-outlined text-outline mr-3">payments</span>
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none" 
                      placeholder="username@upi" 
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-stack-sm">
                  <label className="font-display text-label-md text-on-background block ml-1">Password</label>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2.5 input-focus-effect border border-transparent transition-all">
                    <span className="material-symbols-outlined text-outline mr-3">lock</span>
                    <input 
                      className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-outline-variant outline-none" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      className="text-outline hover:text-on-surface transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button 
                  className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-display font-bold text-body-md py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Registering..." : "Create Account"}</span>
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
              </form>
            </div>

            <p className="mt-8 text-center text-label-sm text-outline px-4">
              By continuing, you agree to Bill Split's{" "}
              <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and{" "}
              <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;