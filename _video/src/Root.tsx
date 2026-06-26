import { Composition } from 'remotion';
import { FraudDeskShort, FRAUD_DESK_SHORT_FRAMES } from './FraudDeskShort';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="FraudDeskShort"
      component={FraudDeskShort}
      durationInFrames={FRAUD_DESK_SHORT_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
