'use client';

import { useState } from 'react';
import { validateRegistrationServer, validatePostServer } from '../../lib/validation/schema';

export default function ValidationPage() {
  const [activeTab, setActiveTab] = useState<'registration' | 'post'>('registration');
  const [formData, setFormData] = useState({
    // Registration form fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Post form fields
    title: '',
    content: '',
    tags: [''],
  });
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    error?: string;
    data?: any;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    if (formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
    }
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationResult(null);

    try {
      const formDataObj = new FormData();
      if (activeTab === 'registration') {
        formDataObj.append('name', formData.name);
        formDataObj.append('email', formData.email);
        formDataObj.append('password', formData.password);
        formDataObj.append('confirmPassword', formData.confirmPassword);

        const result = await validateRegistrationServer(formDataObj);
        setValidationResult(result);
      } else {
        formDataObj.append('title', formData.title);
        formDataObj.append('content', formData.content);
        formData.tags.forEach(tag => formDataObj.append('tags', tag));

        const result = await validatePostServer(formDataObj);
        setValidationResult(result);
      }
    } catch (error) {
      setValidationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Validation Patterns</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Understanding Validation</h2>
        <p className="mb-4">
          Validation is crucial for both user experience and security. This demo shows
          how to implement <strong>client-side validation</strong> for immediate feedback
          and <strong>server-side validation</strong> for security.
        </p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-medium mb-2">Key Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Client Validation:</strong> Improves UX with immediate feedback</li>
            <li><strong>Server Validation:</strong> Ensures data integrity and security</li>
            <li><strong>Schema Reuse:</strong> Share validation logic between client and server</li>
            <li><strong>Structured Errors:</strong> Return meaningful error messages</li>
          </ul>
        </div>

        <p className="mb-4">
          We use <strong>Zod</strong> for schema validation, which provides type safety
          and comprehensive validation rules.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'registration'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('registration')}
          >
            User Registration
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'post'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('post')}
          >
            Post Creation
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'registration' ? (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 2-50 characters, letters and spaces only
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be a valid email address
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8-50 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match the password above
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="My Awesome Post"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 5-100 characters
                </p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be 10-1000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder={`Tag ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={20}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {formData.tags.length < 5 && (
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                  >
                    Add Tag
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  1-5 tags, each up to 20 characters
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Validating...' : 'Validate'}
          </button>
        </form>
      </div>

      {validationResult && (
        <div className={`mb-6 p-4 rounded ${
          validationResult.success
            ? 'bg-green-100 border-l-4 border-green-500'
            : 'bg-red-100 border-l-4 border-red-500'
        }`}>
          <h3 className={`font-medium mb-2 ${
            validationResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {validationResult.success ? 'Validation Successful!' : 'Validation Failed'}
          </h3>

          {validationResult.success ? (
            <div>
              <p className="text-sm mb-2">Validated data:</p>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(validationResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-2">Validation errors:</p>
              <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                {validationResult.error}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Validation Best Practices</h3>

        <div className="mb-4">
          <h4 className="font-medium mb-1">1. Client vs Server Validation</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Client Validation:</strong> Provides immediate feedback, improves UX</li>
            <li><strong>Server Validation:</strong> Ensures data integrity, prevents malicious data</li>
            <li><strong>Never trust client validation alone!</strong> Always validate on server</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">2. Schema Reuse</h4>
          <p className="text-sm">
            Define validation schemas once and reuse them across client and server.
            This ensures consistency and reduces duplication.
          </p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">3. Error Handling</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Return structured error responses with field-specific messages</li>
            <li>Provide clear, actionable error messages to users</li>
            <li>Log validation errors for debugging and monitoring</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">4. Security Considerations</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Sanitize input data to prevent XSS and injection attacks</li>
            <li>Validate data types, lengths, and formats</li>
            <li>Use allowlists rather than blocklists for sensitive operations</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">5. Performance</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Client validation reduces unnecessary server requests</li>
            <li>Server validation should be efficient but thorough</li>
            <li>Consider async validation for expensive checks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
