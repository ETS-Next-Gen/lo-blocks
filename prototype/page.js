'use client';
// @refresh reset

import { TextInput, NavigateButton, ResetButton, LLMFeedback, LLMButton, LLMPrompt, Variable, StoreVariable, List, SideBarPanel, MainPane, ShowComponentButton, HideableComponent } from '../components.js';

export default function Home() {
  return (
    <Changer>
    </Changer>
    );
}

const Changer = ({ children }) => (
  <SideBarPanel>
    <MainPane>
      <h1>Write a text</h1>
      <p>
        Put it in the box provided. After you get feedback and look at examples,
        feel free to revise your answer.
      </p>
      <TextInput id="student_essay" />
      <br />
      <LLMFeedback id="essay_rewrite"/>
    </MainPane>
    <div>
      <p> Rewrite / audience / style </p>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this in simple English for a first grader: {student_essay}</LLMPrompt>
        First Grader Text
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this in contorted social sciences academic English: {student_essay}</LLMPrompt>
        SSR
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this in business English, with a marketing focus: {student_essay}</LLMPrompt>
        Business
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this in first person: {student_essay}</LLMPrompt>
        First person
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">You're a world-class comedian. Please rewrite this to be hillarious, and with an edge. You can make stuff up (hey, it's comedy), but there should be real jokes (not just flippancy): {student_essay}</LLMPrompt>
        Comedian
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">You're a Chinese American. Please rewrite this. Use English, but with Chinese communication style: {student_essay}</LLMPrompt>
        Chinese American
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this text in legal English for a legal filing {student_essay}</LLMPrompt>
        Lawyer
      </LLMButton>
      <br/>
      <LLMButton>
        <LLMPrompt target="essay_rewrite">Please rewrite this text as a lower-to-mid-level middle schooler. Please include middle-school level spelling errors, grammar errors, and style issues; we'll want middle-school students to find and correct issues: {student_essay}</LLMPrompt>
        Middle Schooler
      </LLMButton>
    </div>
  </SideBarPanel>
);

const EssayInput = () => (
  <>
  </>
);
