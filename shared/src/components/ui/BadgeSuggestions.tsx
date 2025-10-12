import React from 'react';

interface BadgeSuggestionsProps {
  suggestions: string[];
  onSelect: (value: string) => void;
}

const BadgeSuggestions: React.FC<BadgeSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4" role="list" aria-label="Sugestões de preenchimento">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="badge-suggestion bg-primary-100 text-primary-700 px-3 py-1 rounded-full shadow hover:bg-primary-200 transition-all text-sm font-medium"
          onClick={() => onSelect(suggestion)}
          aria-label={`Selecionar sugestão: ${suggestion}`}
        >
          {suggestion.toLowerCase()}
        </button>
      ))}
    </div>
  );
};

export default BadgeSuggestions;
