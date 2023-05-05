import { useState, useEffect } from 'react';
import Image from 'next/image';
import SlideYDownTransition from '../components/SlideYDownTransition';
import ChatBot, { ChatBotEvent } from '../components/ChatBot';
import { CreateCurriculumForm } from '../shared/user';
import { Scenario } from '../shared/vue-chat-bot';
import { userState, botState } from '../store';

export default function Index() {
  const [createCurriculumForm, setCreateCurriculumForm] = useState<CreateCurriculumForm>({});
  const [transition, setTransition] = useState({
    after_1000: false,
    after_2000: false,
    after_3500: false,
  });
  const [scenario, setScenario] = useState<Scenario>([]);
  const [scenario2, setScenario2] = useState<Scenario>([]);

  useEffect(() => {
    setAnimationTimeout();
  }, []);

  function moveTitle() {
    const title = document.querySelector('#title');
    const chatBox = document.querySelector('.qkb-board-content__bubbles');
    if (title === null || chatBox === null || chatBox.parentNode === null) return;
    chatBox.before(title);
    document.documentElement.style.setProperty('--bottop', '0px');
    document.documentElement.style.setProperty('--title-margin-bottom', '40px');
  }

  function setAnimationTimeout() {
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_1000: true }));
    }, 1000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_2000: true }));
    }, 2000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_3500: true }));
      moveTitle();
    }, 3500);
  }

  function updateForm({ key, value }: { key: string; value: any }) {
    setCreateCurriculumForm((prev) => ({ ...prev, [key]: value }));

    if (key === 'topics') {
      userState.createCurriculum(createCurriculumForm);
      botState.clearMessageData();
      setTimeout(() => {
        if (scenario2[0][0].options) {
          scenario2[0][0].options[0].to = `/question/id/${
            userState.userCurriculum.length !== 0 ? userState.userCurriculum[0].questionId : 0
          }`;
        }
        setScenario(scenario2);
      }, 2000);
    }
  }

  function handleChatBotEvent(event: ChatBotEvent) {
    if (event.type === 'update' && ['newbie', 'difficulty', 'topics'].includes(event.field)) {
      updateForm({ key: event.field, value: event.value });
    }
  }

  return (
    <div id="index" className="has-background-light2">
      <SlideYDownTransition>
        <div id="title" className={transition.after_2000 ? 'moved' : ''} style={{ display: transition.after_1000 ? 'block' : 'none' }}>
          <h1>
            Welcome to <Image src="/icons/title/glide-30.svg" width={60} height={60} alt="Glide" />!
          </h1>
          <h2 className="mt-2">Your personalized AI Tutor for TOEFL</h2>
        </div>
      </SlideYDownTransition>

      <ChatBot
        style={{ display: transition.after_3500 ? 'block' : 'none' }}
        isOpen={true}
        isDropMenu={false}
        startMessageDelay={3500}
        scenario={scenario}
        onUpdateNewbie={value => updateForm({ key: 'newbie', value })}
        onUpdateDifficulty={value => updateForm({ key: 'difficulty', value })}
        onUpdateTopics={value => updateForm({ key: 'topics', value })}
      />
    </div>
  );
};
