import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const VoiceToTextInput = ({ 
  value, 
  onChange, 
  placeholder = "Start speaking or type your notes...",
  rows = 4
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        // Update the text with the transcript
        onChange({ target: { value: value + ' ' + transcript } });
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          isRecording ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      ></textarea>
      
      {isSupported && (
        <button
          type="button"
          onClick={toggleRecording}
          className={`absolute bottom-3 right-3 p-2 rounded-full ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          <SafeIcon 
            icon={isRecording ? FiIcons.FiMic : FiIcons.FiMic} 
            className="w-5 h-5" 
          />
        </button>
      )}
      
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 right-0 bg-primary-600 text-white text-center text-xs py-1"
        >
          Recording... Speak clearly into your microphone
        </motion.div>
      )}
      
      {!isSupported && (
        <div className="mt-1 text-xs text-gray-500">
          Voice recording is not supported in your browser. Please use Chrome, Edge, or Safari.
        </div>
      )}
    </div>
  );
};

export default VoiceToTextInput;