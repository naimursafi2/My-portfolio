import { useState } from "react";
import { X, CreditCard, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Checkout = ({ selectedPackage, onClose }) => {
  const [step, setStep] = useState("details"); // details | payment | success
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectDetails: "",
    paymentMethod: "card",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setStep("payment");
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setStep("success");
    toast.success("Order placed successfully!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X size={20} />
        </button>

        {step === "success" ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Order Confirmed!</h3>
            <p className="text-muted-foreground mb-2">
              Thank you for choosing the <strong className="text-foreground">{selectedPackage.name}</strong> package.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              I'll reach out to you at <strong className="text-foreground">{form.email}</strong> within 24 hours to get started.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border bg-secondary/30">
              <h3 className="font-display text-xl font-bold">Checkout</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">{selectedPackage.name} Package</span>
                <span className="text-lg font-bold text-primary">{selectedPackage.price}</span>
              </div>
            </div>

            {step === "details" ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Project Details</label>
                  <textarea
                    value={form.projectDetails}
                    onChange={(e) => setForm({ ...form, projectDetails: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form onSubmit={handlePayment} className="p-6 space-y-4">
                {/* Order Summary */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-medium text-foreground">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Client</span>
                    <span className="font-medium text-foreground">{form.name}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">{selectedPackage.price}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "card", label: "Credit Card", icon: CreditCard },
                      { id: "bank", label: "Bank Transfer", icon: Shield },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: method.id })}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                          form.paymentMethod === method.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <method.icon size={16} />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.paymentMethod === "card" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield size={14} className="text-primary" />
                  Integration-ready for Stripe & SSLCommerz
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Pay {selectedPackage.price}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
