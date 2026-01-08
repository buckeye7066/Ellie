import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { MemoryStorage } from '../entities/Memory';
import { StudyCardStorage } from '../entities/StudyCard';

const Settings = () => {
  const handleClearMemories = () => {
    if (window.confirm('Are you sure you want to delete all memories? This cannot be undone.')) {
      MemoryStorage.clear();
      window.location.reload();
    }
  };

  const handleClearStudyCards = () => {
    if (window.confirm('Are you sure you want to delete all study cards? This cannot be undone.')) {
      StudyCardStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your Ellie preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* About */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-purple-600" />
                About Ellie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                Ellie is your personal AI assistant with advanced memory capabilities. 
                She remembers your conversations, helps you study, and learns from every interaction.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">v1.0.0</p>
                  <p className="text-sm text-gray-600">Version</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-2xl font-bold text-pink-600">AI-Powered</p>
                  <p className="text-sm text-gray-600">Technology</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-white/80 backdrop-blur-sm border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Trash2 className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Clear All Memories</h4>
                <p className="text-sm text-gray-600 mb-3">
                  This will permanently delete all your saved memories. This action cannot be undone.
                </p>
                <Button
                  onClick={handleClearMemories}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Memories
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Clear All Study Cards</h4>
                <p className="text-sm text-gray-600 mb-3">
                  This will permanently delete all your study cards and progress. This action cannot be undone.
                </p>
                <Button
                  onClick={handleClearStudyCards}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Study Cards
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Advanced memory system with semantic search</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Interactive avatar with HeyGen integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Spaced repetition study system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>File import and text processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>AI-powered contextual conversations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Memory summarization and insights</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
