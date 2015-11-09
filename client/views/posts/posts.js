Template.posts.events({
  'submit [data-id=insert-post-form]': (event, template) => {
    event.preventDefault();

    let post = {
      body: template.find('[data-id=body]').value
    };

    Meteor.call('posts.insert', post, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
        template.find('[data-id=body]').value = '';
      }
    });
  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
  }, 300),

  'submit [data-id=search-posts-form]': (event, template) => {
    event.preventDefault();
  }
});

Template.posts.helpers({
  posts: () => {
    if (Template.instance().searchQuery.get()) {
      return Posts.find({}, { sort: [['score', 'desc']] });
    }
    return Posts.find({}, { sort: { createdAt: -1 } });
  }
});

Template.posts.onCreated(function () {
  this.searchQuery = new ReactiveVar('');

  this.autorun(() => {
    this.subscribe('posts', this.searchQuery.get());
  });
});