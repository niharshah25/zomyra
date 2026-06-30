/**
 * PersonalityChat — Conversational chat-style interface for personality questions
 * Shows questions as bot messages (left) and user responses (right) with natural pacing
 */
import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Sparkles, ArrowLeft } from "lucide-react-native";
import { colors } from "@/src/theme/colors";
import { SCALE_QUESTIONS } from "@/src/lib/onboarding/scales";
import type { OnboardingState } from "@/src/lib/onboarding/types";

type Message = {
  id: string;
  type: "bot" | "user" | "question";
  text?: string;
  timestamp: string;
  questionId?: string;
  questionData?: {
    prompt: string;
    left: string;
    right: string;
    value: number;
  };
  userResponse?: {
    value: number;
    text: string;
  };
};

type Props = {
  state: OnboardingState;
  onUpdateScale: (id: string, value: number) => void;
  onComplete: () => void;
  onBack?: () => void;
};

export function PersonalityChat({ state, onUpdateScale, onComplete, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const isInitialized = useRef(false);

  // Format timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get response text based on slider value
  const getResponseText = (value: number, left: string, right: string) => {
    if (value === 1) return left;
    if (value === 5) return right;
    if (value < 3) return `Leaning towards ${left.toLowerCase()}`;
    if (value > 3) return `Leaning towards ${right.toLowerCase()}`;
    return "Somewhere in the middle";
  };

  // Add a message with animation
  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: getTimestamp(),
      },
    ]);
    // Scroll to bottom after message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Show welcome message on mount
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      addMessage({
        type: "bot",
        text: "Hi there! 👋\nLet's understand what matters to you in a relationship.\n\nThere are no right or wrong answers, just what feels most like you.\n\nShall we begin?",
      });
      
      // Show first question after welcome
      setTimeout(() => {
        showNextQuestion(0);
      }, 1500);
    }
  }, []);

  // Show the next question
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showNextQuestion = (index: number) => {
    if (index >= SCALE_QUESTIONS.length) {
      // All questions answered, show completion
      setTimeout(() => {
        addMessage({
          type: "bot",
          text: "That's it! 🎉\n\nYour answers help us find better matches that truly fit you.\n\nReady to complete your profile?",
        });
        setShowCompletion(true);
      }, 800);
      return;
    }

    const q = SCALE_QUESTIONS[index];
    const savedValue = state.scales[q.id] ?? 3;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        type: "question",
        questionId: q.id,
        questionData: {
          prompt: q.prompt,
          left: q.left,
          right: q.right,
          value: savedValue,
        },
      });
    }, 600);
  };

  // Handle slider change (auto-submit on release)
  const handleSliderComplete = (questionId: string, value: number) => {
    const q = SCALE_QUESTIONS.find((q) => q.id === questionId);
    if (!q) return;

    // Save the value
    onUpdateScale(questionId, value);

    // Show user's response
    const responseText = getResponseText(value, q.left, q.right);
    addMessage({
      type: "user",
      text: responseText,
      userResponse: { value, text: responseText },
    });

    // Show affirmation after a brief delay
    setTimeout(() => {
      const affirmations = [
        "Love that! 💜",
        "Got it! 💜",
        "Perfect! 💜",
        "Great! 💜",
        "Wonderful! 💜",
      ];
      const affirmation =
        affirmations[Math.floor(Math.random() * affirmations.length)];

      addMessage({
        type: "bot",
        text:
          currentQuestionIndex < SCALE_QUESTIONS.length - 1
            ? `${affirmation}\n\nHere's the next one for you.`
            : `${affirmation}\n\nLast one!`,
      });

      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      setTimeout(() => {
        showNextQuestion(nextIndex);
      }, 800);
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Header with progress and back button */}
      <View style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
        )}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentQuestionIndex + 1) / SCALE_QUESTIONS.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Chat messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.messagesContainer}
      >
        {messages.map((msg) => {
          if (msg.type === "bot") {
            return <BotMessage key={msg.id} text={msg.text!} timestamp={msg.timestamp} />;
          }
          if (msg.type === "user") {
            return <UserMessage key={msg.id} text={msg.text!} timestamp={msg.timestamp} />;
          }
          if (msg.type === "question" && msg.questionData) {
            return (
              <QuestionMessage
                key={msg.id}
                questionId={msg.questionId!}
                data={msg.questionData}
                timestamp={msg.timestamp}
                onComplete={handleSliderComplete}
              />
            );
          }
          return null;
        })}

        {isTyping && <TypingIndicator />}

        {/* Footer hint */}
        {!showCompletion && (
          <View style={styles.footerHint}>
            <Sparkles size={16} color={colors.textSecondary} />
            <Text style={styles.footerHintText}>
              Your answers help us find better matches that truly fit you.
            </Text>
          </View>
        )}

        {/* Completion button */}
        {showCompletion && (
          <View style={styles.completionContainer}>
            <Pressable style={styles.completionButton} onPress={onComplete}>
              <Text style={styles.completionButtonText}>Continue</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Bot message component (left side)
function BotMessage({ text, timestamp }: { text: string; timestamp: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        styles.botMessageRow,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.botAvatar}>
        <Sparkles size={20} color="#fff" />
      </View>
      <View style={styles.botBubbleContainer}>
        <View style={styles.botBubble}>
          <Text style={styles.botText}>{text}</Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </Animated.View>
  );
}

// User message component (right side)
function UserMessage({ text, timestamp }: { text: string; timestamp: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        styles.userMessageRow,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.userBubbleContainer}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{text}</Text>
        </View>
        <Text style={[styles.timestamp, styles.timestampRight]}>{timestamp}</Text>
      </View>
    </Animated.View>
  );
}

// Question message with inline slider
function QuestionMessage({
  questionId,
  data,
  timestamp,
  onComplete,
}: {
  questionId: string;
  data: { prompt: string; left: string; right: string; value: number };
  timestamp: string;
  onComplete: (id: string, value: number) => void;
}) {
  const [sliderValue, setSliderValue] = useState(data.value);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        styles.botMessageRow,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.botAvatar}>
        <Sparkles size={20} color="#fff" />
      </View>
      <View style={styles.botBubbleContainer}>
        <View style={styles.botBubble}>
          <Text style={styles.botText}>{data.prompt}</Text>

          {/* Inline slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{data.left}</Text>
            <Text style={styles.sliderLabel}>{data.right}</Text>
          </View>
          
          <ChatSlider
            value={sliderValue}
            onChange={setSliderValue}
            onComplete={(value) => onComplete(questionId, value)}
          />
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </Animated.View>
  );
}

// Simple slider component for chat
function ChatSlider({
  value,
  onChange,
  onComplete,
}: {
  value: number;
  onChange: (v: number) => void;
  onComplete: (v: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const sliderWidth = 240;

  const handleValueChange = (newValue: number) => {
    const clampedValue = Math.max(1, Math.min(5, newValue));
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };

  const handlePress = (x: number) => {
    const position = Math.max(0, Math.min(x, sliderWidth));
    const newValue = Math.round((position / sliderWidth) * 4) + 1;
    handleValueChange(newValue);
    // Auto-submit after tap
    setTimeout(() => {
      onComplete(newValue);
    }, 300);
  };

  return (
    <View style={styles.chatSlider}>
      <View style={styles.sliderTrack}>
        {/* Active fill */}
        <View
          style={[
            styles.sliderFill,
            { width: `${((localValue - 1) / 4) * 100}%` },
          ]}
        />
        
        {/* Thumb */}
        <View
          style={[
            styles.sliderThumb,
            { left: ((localValue - 1) / 4) * sliderWidth - 10 },
            isDragging && styles.sliderThumbActive,
          ]}
        />
      </View>

      {/* Tap area for interaction */}
      <Pressable
        style={styles.sliderTapArea}
        onPress={(e) => {
          const x = e.nativeEvent.locationX;
          handlePress(x);
        }}
        onPressIn={() => setIsDragging(true)}
        onPressOut={() => {
          setIsDragging(false);
        }}
      />
    </View>
  );
}

// Typing indicator
function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 150),
      createDotAnimation(dot3, 300),
    ]);

    animations.start();

    return () => animations.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.messageRow, styles.botMessageRow]}>
      <View style={styles.botAvatar}>
        <Sparkles size={20} color="#fff" />
      </View>
      <View style={styles.typingBubble}>
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECF5",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#F0ECF5",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  botMessageRow: {
    justifyContent: "flex-start",
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  botBubbleContainer: {
    maxWidth: "75%",
  },
  botBubble: {
    backgroundColor: "#F5F3F8",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
  },
  botText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  userBubbleContainer: {
    maxWidth: "75%",
    alignItems: "flex-end",
  },
  userBubble: {
    backgroundColor: "#E8E0F0",
    borderRadius: 18,
    borderTopRightRadius: 4,
    padding: 16,
  },
  userText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  timestampRight: {
    marginLeft: 0,
    marginRight: 4,
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  chatSlider: {
    marginTop: 8,
    height: 40,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: "#E8E0F0",
    borderRadius: 3,
    position: "relative",
    marginVertical: 17,
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.2 }],
  },
  sliderTapArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  typingBubble: {
    backgroundColor: "#F5F3F8",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  footerHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  footerHintText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
  completionContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  completionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    minWidth: 200,
    alignItems: "center",
  },
  completionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
