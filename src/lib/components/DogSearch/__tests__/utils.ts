// Source: https://stackoverflow.com/questions/78561620/need-help-unit-testing-select-from-shadcn-ui/78767039#78767039

// Required to mock shadcn ui select components :/
export class MockPointerEvent extends Event {
	button: number;
	ctrlKey: boolean;
	pointerType: string;

	constructor(type: string, props: PointerEventInit) {
		super(type, props);
		this.button = props.button || 0;
		this.ctrlKey = props.ctrlKey || false;
		this.pointerType = props.pointerType || 'mouse';
	}
}
