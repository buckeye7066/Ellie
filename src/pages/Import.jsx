import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useMemories } from '../hooks/useMemories';
import { extractTextFromFile } from '../lib/llm';
import { cn } from '../lib/utils';

const Import = () => {
  const { saveMemory } = useMemories();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const results = [];

    for (const file of files) {
      const extractedText = await extractTextFromFile(file);
      
      if (extractedText) {
        // Split by paragraphs for larger files
        const paragraphs = extractedText
          .split('\n\n')
          .map(p => p.trim())
          .filter(p => p.length > 20); // Skip very short segments

        // Save each paragraph as a memory
        for (const paragraph of paragraphs) {
          saveMemory({
            content: paragraph,
            source: 'import',
            tags: ['imported', file.name.split('.')[0]],
            importance: 5,
            context: `Imported from ${file.name}`,
          });
        }

        results.push({
          filename: file.name,
          status: 'success',
          count: paragraphs.length,
        });
      } else {
        results.push({
          filename: file.name,
          status: 'error',
          message: 'Failed to extract content',
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);

    // Clear results after 5 seconds
    setTimeout(() => setUploadResults([]), 5000);
  };

  const handleTextImport = () => {
    if (!textInput.trim()) return;

    setIsProcessingText(true);

    // Split by paragraphs
    const paragraphs = textInput
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 10);

    // Save each paragraph as a memory
    paragraphs.forEach(paragraph => {
      saveMemory({
        content: paragraph,
        source: 'import',
        tags: ['text-import'],
        importance: 5,
        context: 'Manually imported text',
      });
    });

    setUploadResults([{
      filename: 'Text Input',
      status: 'success',
      count: paragraphs.length,
    }]);

    setTextInput('');
    setIsProcessingText(false);

    // Clear results after 5 seconds
    setTimeout(() => setUploadResults([]), 5000);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Import Content
          </h1>
          <p className="text-gray-600">
            Upload files or paste text to add to your memories
          </p>
        </div>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-2"
          >
            {uploadResults.map((result, index) => (
              <Card
                key={index}
                className={cn(
                  "bg-white/80 backdrop-blur-sm",
                  result.status === 'success' ? 'border-green-300' : 'border-red-300'
                )}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{result.filename}</p>
                      {result.status === 'success' ? (
                        <p className="text-sm text-gray-600">
                          {result.count} memories created
                        </p>
                      ) : (
                        <p className="text-sm text-red-600">{result.message}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.pdf,.csv,.docx,.doc"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                      <p className="text-sm text-gray-600">Processing files...</p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-12 h-12 text-purple-600" />
                      <div>
                        <p className="text-gray-800 font-medium mb-1">
                          Click to upload files
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, TXT, CSV, DOCX
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">How it works:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Upload documents to extract content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Content is split into paragraphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Each paragraph is saved as a memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Automatically tagged with filename</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Text Input Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-600" />
                Paste Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your content here...&#10;&#10;Separate different topics with blank lines for better organization."
                className="min-h-[200px] resize-none"
                disabled={isProcessingText}
              />

              <Button
                onClick={handleTextImport}
                disabled={!textInput.trim() || isProcessingText}
                className="w-full"
                variant="secondary"
              >
                {isProcessingText ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Text
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Paste notes, articles, or any text content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Use blank lines to separate topics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Each paragraph becomes a searchable memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Perfect for quick notes and ideas</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supported Formats */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-900 mb-3">Supported File Formats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { format: 'TXT', desc: 'Plain text files' },
                { format: 'CSV', desc: 'Comma-separated values' },
                { format: 'PDF', desc: 'PDF documents' },
                { format: 'DOCX', desc: 'Word documents' },
              ].map((item) => (
                <div key={item.format} className="text-center">
                  <Badge variant="outline" className="mb-1">{item.format}</Badge>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Import;
