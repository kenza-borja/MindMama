import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // <--- NEW IMPORT
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { addAiMealToPlan } from '../lib/api'; // <--- API IMPORT

// --- Define Screen Prop Type ---
type AIChatScreenProps = BottomTabScreenProps<RootTabParamList, 'AIChat'>;

// --- Chat Flow State Definitions (Simplified for API focus) ---
type Message = {
  id: number;
  type: 'ai' | 'user';
  text: string;
};

// Start with the AI confirming the plan details (implicitly passed from previous screen)
const INITIAL_CHAT_MESSAGES: Message[] = [
    { id: 1, type: 'ai', text: 'Hi ! Sara ! Im your AI assistant' },
    { id: 2, type: 'ai', text: 'You want 2 days of meals for Monday and Tuesday, right? ' },
    { id: 3, type: 'user', text: 'Yes' },
    { id: 4, type: 'ai', text: 'Do you have a feeling about something specific you want to eat?' },
];

// --- Reusable Components (Omitted for brevity, assumed unchanged) ---
const ChatBubble: React.FC<any> = ({ message }) => (
    <View style={[styles.bubbleWrapper, message.type === 'user' ? styles.userWrapper : styles.aiWrapper]}>
      <View style={[styles.bubble, message.type === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, message.type === 'user' ? styles.userText : styles.aiText]}>
          {message.text}
        </Text>
      </View>
    </View>
);

const SuggestionChip: React.FC<any> = ({ label }) => (
    <TouchableOpacity style={styles.suggestionChip}>
        <View style={styles.chipPlaceholder} />
        <Text style={styles.suggestionChipText}>{label}</Text>
    </TouchableOpacity>
);
// --- End Reusable Components ---


// --- Main Screen Component ---
const AIChatScreen: React.FC<AIChatScreenProps> = ({ navigation, route }) => {
  const planId = (route.params as any)?.planId; // Retrieve planId from navigation params

  const [messages, setMessages] = useState<Message[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);

  // --- Core API Integration: Submit User Preference to AI Endpoint ---
  const handleGenerateMeal = async (preference: string) => {
    if (!planId) {
        setError("Plan ID missing. Cannot generate meal.");
        return;
    }

    if (isSending) return;

    // 1. Add user's preference message to the chat
    const userMessage: Message = { id: Date.now(), type: 'user', text: preference };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);
    setError(null);

    // 2. Mock AI thinking message (Sugg Ai - 6 style response)
    const thinkingMessage: Message = { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: 'Okay, Im gonna make a meal plan for these 2 days and after that, you could change or modify your meal plan.' 
    };
    setMessages(prev => [...prev, thinkingMessage]);


    // 3. API Call: Send the preference to the AI endpoint
    const payload = {
      date: new Date().toISOString().split('T')[0], // Placeholder date
      label: 'AI Generated Plan',
      preferences: { user_input: preference }, // Sending the preference string
    };

    try {
      const apiResponse = await addAiMealToPlan(planId, payload);
      
      // 4. Final Success message or specific recipe details from API (mocked here)
      const successMessage: Message = { 
          id: Date.now() + 2, 
          type: 'ai', 
          text: `Success! Plan ID ${planId} updated with new AI suggestions.` 
      };
      setMessages(prev => [...prev, successMessage]);

    } catch (e: any) {
        console.error("AI Meal generation failed:", e);
        setError("AI Generation failed: " + e.message);

        // 5. Add error message to chat flow
        const errorMessage: Message = { id: Date.now() + 2, type: 'ai', text: `Sorry, an error occurred: ${e.message}` };
        setMessages(prev => [...prev, errorMessage]);

    } finally {
        setIsSending(false);
    }
  };
  
  // Handles both text input and suggestion chip clicks
  const handleSendMessage = (text: string) => {
      if (text.trim()) {
          handleGenerateMeal(text);
      }
  }


  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sara's Kitchen</Text>
        <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#000" style={styles.iconStyle} />
      </View>
      <View style={styles.rightHeaderBox} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
            style={styles.container} 
            ref={scrollViewRef}
            // Auto-scroll to the bottom when new message arrives
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <Header />
          
          {/* Progress Dots/Placeholder Lines */}
          <View style={styles.progressContainer}>
              {Array(5).fill(0).map((_, i) => (
                  <View key={i} style={[styles.progressDot, i === 2 && styles.progressDotActive]} />
              ))}
          </View>

          {/* AI Assistant Avatar/Intro */}
          <View style={styles.assistantIntro}>
            <View style={styles.sparkleIcon}><Text style={{fontSize: 30}}>✨</Text></View>
            <Text style={styles.assistantTitle}>Hi ! Sara !</Text>
            <Text style={styles.assistantSubtitle}>Im your AI assistant</Text>
          </View>

          {/* Chat Bubbles */}
          <View style={styles.chatArea}>
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            {isSending && (
                <View style={styles.aiWrapper}>
                    <ActivityIndicator size="small" color="#000" />
                    <Text style={{marginLeft: 8, color: '#888'}}>AI is thinking...</Text>
                </View>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          
        </ScrollView>

        {/* Input Area (Outside ScrollView) */}
        <View style={styles.inputContainerWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionChipsRow}>
                {/* Fixed chips */}
                <SuggestionChip label="Lorem ipsum" />
                <SuggestionChip label="Lorem ipsum" />
                <SuggestionChip label="Lorem ipsum" />
            </ScrollView>
            
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ask anything"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => handleSendMessage(inputText)}
                    editable={!isSending}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, isSending && styles.sendButtonDisabled]} 
                    onPress={() => handleSendMessage(inputText)}
                    disabled={isSending || !inputText.trim()}
                >
                    <Ionicons name="arrow-up" size={24} color={isSending || !inputText.trim() ? '#9CA3AF' : '#000'} />
                </TouchableOpacity>
            </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Stylesheet (Includes previous chat/UI styles) ---

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 15,
    },
    // Header Styles
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 15,
    },
    backButton: {
      marginRight: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginRight: 8,
    },
    iconStyle: {},
    rightHeaderBox: {
      width: 30,
      height: 30,
      backgroundColor: '#ddd',
      borderRadius: 5,
      marginLeft: 'auto',
    },
    
    // Progress Dots (Same as other screens)
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 10,
      marginBottom: 25,
    },
    progressDot: {
      width: '18%',
      height: 3,
      backgroundColor: '#ddd',
      borderRadius: 5,
      marginRight: '2%',
    },
    progressDotActive: {
      backgroundColor: '#000',
    },
  
    // Assistant Intro (Sugg Ai - 1)
    assistantIntro: {
      alignItems: 'center',
      marginBottom: 30,
    },
    sparkleIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    assistantTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    assistantSubtitle: {
      fontSize: 16,
      color: '#888',
    },
  
    // Chat Area
    chatArea: {
      paddingVertical: 10,
      minHeight: 150,
      paddingBottom: 20,
    },
    bubbleWrapper: {
      flexDirection: 'row',
      marginVertical: 5,
    },
    aiWrapper: {
      justifyContent: 'flex-start',
      flexDirection: 'row', // For loading indicator
      alignItems: 'center',
    },
    userWrapper: {
      justifyContent: 'flex-end',
    },
    bubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 18,
    },
    aiBubble: {
      backgroundColor: '#F3F4F6',
      borderTopLeftRadius: 5,
    },
    userBubble: {
      backgroundColor: '#6B7280',
      borderBottomRightRadius: 5,
    },
    bubbleText: {
      fontSize: 15,
    },
    aiText: {
      color: '#000',
    },
    userText: {
      color: '#fff',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 14,
    },
  
    // Input Wrapper
    inputContainerWrapper: {
      paddingTop: 10,
      paddingHorizontal: 15,
      paddingBottom: Platform.OS === 'ios' ? 30 : 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    suggestionChipsRow: {
      marginBottom: 15,
      paddingRight: 10,
    },
    suggestionChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: '#F3F4F6',
      marginRight: 10,
      height: 40,
    },
    chipPlaceholder: {
      width: 20,
      height: 20,
      backgroundColor: '#ddd',
      borderRadius: 5,
      marginRight: 8,
    },
    suggestionChipText: {
      fontSize: 14,
      color: '#555',
    },
    
    // Text Input Row
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 50,
    },
    textInput: {
      flex: 1,
      height: '100%',
      fontSize: 16,
    },
    sendButton: {
      width: 35,
      height: 35,
      borderRadius: 20,
      backgroundColor: '#D1D5DB', // Gray background for send button
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
        backgroundColor: '#E5E7EB',
    },
  });
  
  export default AIChatScreen;