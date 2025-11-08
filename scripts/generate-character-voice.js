import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import fs from "fs";

// Initialize OpenAI
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Character Voice Profiles (Male-Tuned) ---
const CHARACTER_SETTINGS = {
  elon: {
    voice: "alloy",
    text: `
<speak>
  <prosody rate="68%" pitch="-25%" volume="+4dB">
    <voice gender="male">
    <prosody timbre="baritone">
      <p>
        <break time="0.5s"/>
        Well… <break time="0.45s"/>
        so— <break time="0.25s"/>
        um… <break time="0.35s"/>
        the first-principles approach is… 
        <break time="0.3s"/>
        you know— <break time="0.35s"/>
        it's about <emphasis level="moderate">expanding what's possible</emphasis>.
      </p>

      <p>
        <break time="0.55s"/>
        If you don't do that… <break time="0.3s"/>
        the probability of civilization-level risk 
        rises… <break time="0.5s"/>
        exponentially.
      </p>
    </prosody>
    </voice>
  </prosody>
</speak>
`
  },

  spiderman: {
    // Changed base voice from "shimmer" to "verse" for a more distinct male tone
    voice: "nova", 
    text: `
<speak>
  <prosody rate="115%" pitch="-15%" volume="+3dB"> 
    <voice gender="male">
    <prosody timbre="baritone">
      Okay— okay— <break time="0.12s"/>
      sooo… <break time="0.15s"/>
      game plan time: <break time="0.15s"/>
      hit hard, hit fast, <break time="0.12s"/>
      and try— <emphasis level="moderate">really try</emphasis>  
      not to glue myself to a pigeon <break time="0.12s"/> again.
      <break time="0.25s"/>

      Look, it was <prosody pitch="+4%">one time</prosody>.  
      <break time="0.18s"/>
      And it was kinda funny.  
      <break time="0.18s"/>
      I'm just trying to lighten the mood here.
    </prosody>
    </voice>
  </prosody>
</speak>
`
  }
};
// --- Generate Voice Function ---
async function generateVoice(character) {
  const settings = CHARACTER_SETTINGS[character];
  if (!settings) {
    console.error("Unknown character:", character);
    return;
  }

  console.log(`🎤 Generating: ${character}...`);

  try {
    const response = await client.audio.speech.create({
      model: "tts-1-hd",
      voice: settings.voice,
      input: settings.text,
      format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(`voice-${character}.mp3`, buffer);

    console.log(`✅ Saved voice-${character}.mp3`);
  } catch (err) {
    console.error(`❌ Error generating ${character}:`, err.message);
  }
}

// --- Execute Both ---
(async () => {
  await generateVoice("elon");
  await generateVoice("spiderman");
})();
