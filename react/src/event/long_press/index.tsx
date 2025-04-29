import { useLongPress } from './useLongPressV2';

const LongPress = () => {

    const longPressProps = useLongPress({
    onLongPressStart: (e) => console.log('长按开始!', e.type),
    onLongPressEnd: (e) => console.log('长按结束!', e.type),
    onClick: (e) => console.log('点击!', e.type),
    onCancel: (e) => console.log('意外取消!', e.type),
    delay: 500,
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div
        className="w-40 h-40 bg-blue-400"
        {...longPressProps}
      ></div>
    </div>
  );
};

export default LongPress;
