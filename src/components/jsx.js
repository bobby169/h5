import { withModifiers, defineComponent, ref } from 'vue';

export const Test1 = defineComponent({
  setup() {
    const count = ref(0);

    const inc = () => {
      count.value++;
    };

    return () => (
      <div onClick={withModifiers(inc, ['self'])}>
        {count.value}
      </div>
    );
  }
})

export const Test2 = () => (
  <>
    <span>I'm</span>
    <span>Fragment</span>
  </>
);

const placeholderText = 'email';
export const Test3 = () => (
  <input
    type="email"
    placeholder={placeholderText}
  />
);

export const Test4 = {
  data() {
    return { visible: true };
  },
  render() {
    return <input v-show={this.visible} />;
  },
};


export const Test5 = {
  setup() {
    const slots = {
      foo: () => <span>B</span>
    };
    return () => (
      <A v-slots={slots}>
        <div>A</div>
      </A>
    );
  }
};

export const Test = {
  setup() {
    const slots = {
      default: () => <div>A</div>,
      foo: () => <span>B</span>
    };
    return () => <A v-slots={slots} />;
  }
};
