import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Wrong email or password");
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
        <section className="flex-1 flex flex-col p-8 md:p-16 bg-white relative justify-center">
          {/* Mobile Brand Logo */}
          <div className="md:hidden flex items-center gap-2 mb-10">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            <span className="font-display text-headline-md font-bold text-primary">Bill Split</span>
          </div>

          <div className="w-full max-w-md mx-auto">
            {/* Toggle Tabs */}
            <div className="flex border-b border-surface-container-high mb-8">
              <button className="flex-1 pb-4 font-display font-semibold text-label-md transition-all duration-200 tab-active" disabled>
                Sign In
              </button>
              <button 
                className="flex-1 pb-4 font-display font-semibold text-label-md transition-all duration-200 text-on-surface-variant hover:text-primary"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div>
              <div className="mb-8">
                <h3 className="font-display text-headline-lg font-bold text-on-background mb-2">Welcome Back</h3>
                <p className="font-body-md text-on-surface-variant">Log in to your dashboard to manage your shared bills.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error-container/20 border border-error/20 text-error text-sm rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-gutter" onSubmit={handleSubmit}>
                <div className="space-y-stack-sm">
                  <label className="font-display text-label-md text-on-background block ml-1">Email Address</label>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 input-focus-effect border border-transparent transition-all">
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
                  <div className="flex justify-between items-center px-1">
                    <label className="font-display text-label-md text-on-background">Password</label>
                    <a className="text-label-sm text-secondary font-semibold hover:underline" href="#">Forgot?</a>
                  </div>
                  <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 input-focus-effect border border-transparent transition-all">
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
                  className="w-full bg-primary-container hover:bg-primary-container/90 text-white font-display font-bold text-body-md py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Authenticating..." : "Log In"}</span>
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div class="w-full border-t border-surface-container-high"></div></div>
                <div className="relative flex justify-center text-label-sm uppercase tracking-wider"><span className="bg-white px-4 text-outline">Or continue with</span></div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 border border-outline-variant rounded-xl py-3 hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-label-md font-semibold group-hover:text-primary transition-colors">Google</span>
                </button>
                <button className="flex items-center justify-center gap-3 border border-outline-variant rounded-xl py-3 hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  <span className="text-label-md font-semibold group-hover:text-primary transition-colors">Facebook</span>
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-label-sm text-outline px-4">
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

export default Login;