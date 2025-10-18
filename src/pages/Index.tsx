import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Target,
      title: 'Personalized Paths',
      description: 'Get custom learning roadmaps tailored to your career goals and skill level',
    },
    {
      icon: BookOpen,
      title: 'Curated Courses',
      description: 'Access quality courses from top platforms, organized by difficulty',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with visual progress tracking',
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Receive intelligent course suggestions based on your goals',
    },
  ];

  const benefits = [
    'Structured learning paths based on your schedule',
    'Progress tracking and achievement milestones',
    'Courses from Coursera, Udemy, edX, and more',
    'Flexible pacing that adapts to your life',
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6 shadow-glow animate-pulse-glow">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Your Path to
              </span>
              <br />
              <span className="text-foreground">Career Success</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Generate personalized learning roadmaps powered by your goals. Track progress, 
              stay motivated, and achieve your career dreams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto border-2"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>5 min setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-primary bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you master new skills and advance your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-primary transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">PathFinder</span>?
                </h2>
                <p className="text-lg text-muted-foreground">
                  We combine the best educational resources with smart technology to create 
                  personalized learning experiences that actually work.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Card className="p-8 bg-gradient-primary text-primary-foreground shadow-glow animate-scale-in">
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-bold mb-2">10,000+</div>
                    <div className="text-primary-foreground/80">Learning paths created</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">95%</div>
                    <div className="text-primary-foreground/80">User satisfaction rate</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold mb-2">50+</div>
                    <div className="text-primary-foreground/80">Career paths covered</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="p-12 md:p-16 text-center bg-gradient-hero shadow-glow animate-scale-in">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Start Your Learning Journey Today
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Join thousands of learners who are already advancing their careers with PathFinder
              </p>
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="shadow-glow"
              >
                Create Your Free Path
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">PathFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PathFinder. Empowering learners worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
