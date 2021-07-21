import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Portal } from '@gorhom/portal';

type TooltipProps = {
  anchor: React.ReactNode;
  popover: React.ReactNode;
  withBackdrop?: boolean;
};

type AnchorProps = {
  component: React.ReactNode;
  openPopover: () => void;
};

type PopoverProps = {
  component: React.ReactNode;
  closePopover: () => void;
  isPopoverOpen: boolean;
  anchorRef: React.RefObject<TouchableOpacity>;
  withBackdrop: boolean;
};

const Anchor = React.forwardRef<TouchableOpacity, AnchorProps>(
  ({ component, openPopover }, ref) => {
    return (
      <TouchableOpacity onPress={openPopover} ref={ref}>
        {component}
      </TouchableOpacity>
    );
  },
);

const Popover: React.FC<PopoverProps> = ({
  component,
  closePopover,
  isPopoverOpen,
  anchorRef,
  withBackdrop,
}) => {
  const [anchorPosition, setAnchorPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  }>();
  const ref = useRef<View>(null);
  const [selfDimensions, setSelfDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    ref.current?.measure((x, y, width, height, pageX, pageY) =>
      setSelfDimensions({ width, height }),
    );
  }, [ref.current]);
  anchorRef.current?.measure((x, y, width, height, pageX, pageY) =>
    setAnchorPosition({ x, y, width, height, pageX, pageY }),
  );
  let left = 0;
  let top = 0;
  if (anchorPosition) {
    // Set left position
    if (anchorPosition.pageX - selfDimensions.width / 2 > 20) {
      left = anchorPosition.pageX - selfDimensions.width / 2;
    } else {
      left = 20;
    }
    // Set top position
    if (anchorPosition.pageY - anchorPosition.height - selfDimensions.height > 0) {
      // If the popover can fit above the anchor and still be entirely on the screen, render above
      top = anchorPosition.pageY - anchorPosition.height - selfDimensions.height;
    } else {
      // Otherwise, render below
      top = anchorPosition.pageY + anchorPosition.height + 5;
    }
  }
  return isPopoverOpen ? (
    <Portal>
      <TouchableOpacity
        style={[
          styles.backdrop,
          { backgroundColor: withBackdrop ? 'rgba(0,0,0,0.25)' : 'transparent' },
        ]}
        onPress={closePopover}></TouchableOpacity>
      <View
        ref={ref}
        style={{
          position: 'absolute',
          left: left,
          top: top,
          zIndex: 10,
          elevation: 3,
        }}>
        {component}
      </View>
    </Portal>
  ) : (
    <></>
  );
};

const Tooltip: React.FC<TooltipProps> = ({ anchor, popover, withBackdrop = false }) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const anchorRef = useRef<TouchableOpacity>(null);
  return (
    <>
      <Anchor component={anchor} openPopover={() => setShowPopover(true)} ref={anchorRef} />
      <Popover
        component={popover}
        closePopover={() => setShowPopover(false)}
        isPopoverOpen={showPopover}
        anchorRef={anchorRef}
        withBackdrop={withBackdrop}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9,
  },
});

export default Tooltip;
