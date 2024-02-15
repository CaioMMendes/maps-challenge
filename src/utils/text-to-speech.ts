type setSpeakingType = React.MutableRefObject<boolean>;

export const textToSpeech = (text: string, speaking: setSpeakingType) => {
  if ("speechSynthesis" in window) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    // Evento chamado quando a fala começa
    utterance.onstart = () => {
      speaking.current = true;
    };

    // Evento chamado quando a fala termina
    utterance.onend = () => {
      speaking.current = false;
    };
  } else {
    console.error("Text-to-speech is not supported in this browser.");
  }
};
