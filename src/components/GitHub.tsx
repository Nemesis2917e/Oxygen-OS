import { Github, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

export const GitHub = () => {
  const handleOpenGitHub = () => {
    window.open('https://github.com/Nemesis2917e', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-primary/10">
            <Github className="h-16 w-16 md:h-20 md:w-20 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Visit My GitHub</h2>
          <p className="text-muted-foreground">
            Check out my projects and contributions
          </p>
        </div>

        <Button 
          onClick={handleOpenGitHub}
          size="lg"
          className="gap-2 w-full sm:w-auto"
        >
          <Github className="h-5 w-5" />
          Open GitHub Profile
          <ExternalLink className="h-4 w-4" />
        </Button>

        <p className="text-sm text-muted-foreground">
          github.com/Nemesis2917e
        </p>
      </div>
    </div>
  );
};
