import mixpanel, { Dict } from 'mixpanel-browser';
mixpanel.init('1c71613b1e10893e836e4dafd7ece747');

let env_check = process.env.NODE_ENV === 'production';

let actions = {
  identify: (id?: string) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id: string) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name: string, props?: Dict) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props: Dict) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;