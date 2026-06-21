import { Check, Minus, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"

const plans = [
  {
    name: "Essential",
    price: "Complimentary",
    description: "For the occasional collector.",
    features: {
      "Free Shipping": true,
      "Extended Returns": false,
      "Priority Support": false,
      "Private Viewings": false,
      "Concierge Service": false,
      "Early Access": false,
      "Invitation to Events": false,
    },
  },
  {
    name: "Luxora",
    price: "$500/yr",
    description: "For the dedicated connoisseur.",
    popular: true,
    features: {
      "Free Shipping": true,
      "Extended Returns": true,
      "Priority Support": true,
      "Private Viewings": false,
      "Concierge Service": false,
      "Early Access": false,
      "Invitation to Events": false,
    },
  },
  {
    name: "Patron",
    price: "$2,500/yr",
    description: "The ultimate luxury experience.",
    features: {
      "Free Shipping": true,
      "Extended Returns": true,
      "Priority Support": true,
      "Private Viewings": true,
      "Concierge Service": true,
      "Early Access": true,
      "Invitation to Events": true,
    },
  },
]

const allFeatures = Object.keys(plans[0].features)

export function PricingSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            Membership
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Choose Your Experience
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elevate your luxury journey with our tiered membership programs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="font-heading text-3xl font-bold">
                    {plan.price}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {allFeatures.map((feature) => {
                  const included = plan.features[
                    feature as keyof typeof plan.features
                  ]
                  return (
                    <div key={feature} className="flex items-center gap-3">
                      {included ? (
                        <Check
                          size={16}
                          className="shrink-0 text-accent"
                        />
                      ) : (
                        <Minus
                          size={16}
                          className="shrink-0 text-muted-foreground/50"
                        />
                      )}
                      <span
                        className={`text-sm ${
                          included ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className={`mt-8 w-full gap-2 ${
                  plan.popular ? "" : "border-border/50"
                }`}
              >
                {plan.price === "Complimentary" ? "Join Free" : "Subscribe"}
                <ArrowRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
