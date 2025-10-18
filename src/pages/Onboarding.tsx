import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useLearningPathStore } from '@/stores/learningPathStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Loader2, ArrowRight, ArrowLeft, Target, Clock, TrendingUp } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const formSchema = z.object({
  careerGoal: z.string().min(3, 'Career goal must be at least 3 characters').max(200),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  weeklyHours: z.number().min(1).max(40),
  durationMonths: z.number().min(1).max(24),
  currentSkills: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPath } = useLearningPathStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerGoal: '',
      skillLevel: 'beginner',
      weeklyHours: 10,
      durationMonths: 6,
      currentSkills: '',
    },
  });

  const generateMockCourses = (careerGoal: string, skillLevel: string) => {
    const phases = ['Foundation', 'Intermediate', 'Advanced', 'Specialization'];
    const difficulties = ['beginner', 'intermediate', 'intermediate', 'advanced'];
    const providers = ['Coursera', 'Udemy', 'edX', 'Pluralsight'];
    
    return phases.map((phase, index) => ({
      title: `${careerGoal} - ${phase} Level`,
      description: `Master ${phase.toLowerCase()} concepts for ${careerGoal}`,
      provider: providers[index % providers.length],
      difficulty: difficulties[index],
      duration_weeks: (index + 1) * 4,
      url: `https://coursera.org/search?query=${encodeURIComponent(careerGoal)}`,
      phase,
      sequence_order: index + 1,
    }));
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Insert learning path
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .insert({
          user_id: user.id,
          career_goal: data.careerGoal,
          skill_level: data.skillLevel,
          weekly_hours: data.weeklyHours,
          duration_months: data.durationMonths,
          current_skills: data.currentSkills.split(',').map(s => s.trim()),
        })
        .select()
        .single();

      if (pathError) throw pathError;

      // Generate and insert courses
      const mockCourses = generateMockCourses(data.careerGoal, data.skillLevel);
      const coursesWithPathId = mockCourses.map(course => ({
        ...course,
        path_id: pathData.id,
      }));

      const { error: coursesError } = await supabase
        .from('courses')
        .insert(coursesWithPathId);

      if (coursesError) throw coursesError;

      addPath({ ...pathData, courses: coursesWithPathId } as any);
      toast.success('Your learning path has been generated!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating learning path:', error);
      toast.error(error.message || 'Failed to create learning path');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['careerGoal', 'skillLevel'] : ['weeklyHours', 'durationMonths'];
    const isValid = await form.trigger(fields as any);
    if (isValid && step < 3) setStep(step + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="w-full max-w-2xl p-8 shadow-card animate-scale-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Create Your Learning Path
            </h1>
            <p className="text-muted-foreground">Step {step} of 3</p>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="careerGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">
                          <Target className="w-5 h-5 text-primary" />
                          Career Goal
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Full-Stack Developer, Data Scientist, UX Designer"
                            {...field}
                            className="text-lg p-6"
                          />
                        </FormControl>
                        <FormDescription>
                          What career or skill do you want to achieve?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Current Skill Level
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-lg p-6">
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                            <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                            <SelectItem value="advanced">Advanced - Experienced professional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="weeklyHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">
                          <Clock className="w-5 h-5 text-primary" />
                          Weekly Time Commitment: {field.value} hours
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={40}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          How many hours per week can you dedicate to learning?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          Learning Duration: {field.value} months
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={24}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          How long do you want your learning journey to be?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="currentSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Current Skills (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., HTML, CSS, JavaScript, Python"
                            {...field}
                            className="text-lg p-6"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter skills separated by commas. This helps us personalize your path.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gradient-card p-6 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2">Ready to Start?</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll generate a personalized learning path tailored to your goals and schedule.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    variant="default"
                    onClick={nextStep}
                    className="flex-1"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Path...
                      </>
                    ) : (
                      <>
                        Generate My Path
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Onboarding;
