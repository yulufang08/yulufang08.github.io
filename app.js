/**
 * Section navigation, theme (dark/light), and blog authentication.
 */
(function () {
  const THEME_KEY = 'theme';
  const BLOG_TOKEN_KEY = 'blog_token';
  const BLOG_EXPIRY_KEY = 'blog_token_expiry';

  function getTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(function (s) {
      s.classList.toggle('active', s.id === sectionId);
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const id = a.getAttribute('data-section');
      a.removeAttribute('data-active');
      if (id === sectionId) a.setAttribute('data-active', '');
    });
  }

  // Blog authentication
  function isBlogTokenValid() {
    const token = localStorage.getItem(BLOG_TOKEN_KEY);
    const expiry = localStorage.getItem(BLOG_EXPIRY_KEY);
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry);
  }

  function showBlogAuthModal() {
    const modal = document.getElementById('blog-auth-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      document.getElementById('blog-password-input').focus();
      document.getElementById('blog-auth-error').style.display = 'none';
    }
  }

  function hideBlogAuthModal() {
    const modal = document.getElementById('blog-auth-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.getElementById('blog-password-input').value = '';
      document.getElementById('blog-auth-error').style.display = 'none';
    }
  }

  function authenticateBlog(password) {
    const errorMsg = document.getElementById('blog-auth-error');
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    fetch('/api/blog/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    })
    .then(function(res) {
      if (!res.ok) return res.json().then(function(err) { throw err; });
      return res.json();
    })
    .then(function(data) {
      localStorage.setItem(BLOG_TOKEN_KEY, data.token);
      localStorage.setItem(BLOG_EXPIRY_KEY, data.expiresAt);
      hideBlogAuthModal();
      showSection('blog');
      loadBlogPosts();
    })
    .catch(function(err) {
      errorMsg.textContent = '密码错误，请重试';
      errorMsg.style.display = 'block';
      console.error('Auth error:', err);
    });
  }

  function loadBlogPosts() {
    const token = localStorage.getItem(BLOG_TOKEN_KEY);
    if (!token) return;

    fetch('/api/blog/posts', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load posts');
      return res.json();
    })
    .then(function(data) {
      renderBlogPostList(data.posts);
    })
    .catch(function(err) {
      console.error('Error loading posts:', err);
      document.getElementById('blog-post-list').innerHTML = '<p>无法加载文章列表</p>';
    });
  }

  function renderBlogPostList(posts) {
    const listContainer = document.getElementById('blog-post-list');
    if (!listContainer) return;

    if (!posts || posts.length === 0) {
      listContainer.innerHTML = '<p>暂无文章</p>';
      return;
    }

    listContainer.innerHTML = posts.map(function(post) {
      const tagsHtml = post.tags && post.tags.length > 0
        ? '<div class="blog-post-tags">' + post.tags.map(function(tag) {
            return '<span class="blog-tag">' + tag + '</span>';
          }).join('') + '</div>'
        : '';

      return '<div class="blog-post-item" data-post-id="' + post.id + '">' +
        '<h3 class="blog-post-title">' + post.title + '</h3>' +
        '<p class="blog-post-date">' + post.date + '</p>' +
        tagsHtml +
      '</div>';
    }).join('');

    // Add click handlers
    listContainer.querySelectorAll('.blog-post-item').forEach(function(item) {
      item.addEventListener('click', function() {
        const postId = this.getAttribute('data-post-id');
        loadBlogPost(parseInt(postId));
      });
    });
  }

  function loadBlogPost(postId) {
    const token = localStorage.getItem(BLOG_TOKEN_KEY);
    if (!token) return;

    fetch('/api/blog/posts/' + postId, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load post');
      return res.json();
    })
    .then(function(post) {
      renderBlogPostDetail(post);
    })
    .catch(function(err) {
      console.error('Error loading post:', err);
    });
  }

  function renderBlogPostDetail(post) {
    const listDiv = document.getElementById('blog-post-list');
    const detailDiv = document.getElementById('blog-post-detail');
    const contentDiv = document.getElementById('blog-post-content');

    if (!listDiv || !detailDiv || !contentDiv) return;

    contentDiv.innerHTML = '<h2>' + post.title + '</h2>' +
      '<p style="color: var(--text-muted);">发布于 ' + post.date + '</p>' +
      '<div class="blog-post-content">' + post.content + '</div>' +
      '<div id="blog-comments-section"></div>';

    listDiv.style.display = 'none';
    detailDiv.style.display = 'block';

    // Load and display comments
    loadComments(post.id);
  }

  function loadComments(postId) {
    fetch('/api/blog/posts/' + postId + '/comments')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load comments');
        return res.json();
      })
      .then(function(data) {
        renderComments(postId, data.comments);
      })
      .catch(function(err) {
        console.error('Error loading comments:', err);
      });
  }

  function renderComments(postId, comments) {
    const section = document.getElementById('blog-comments-section');
    if (!section) return;

    let html = '<div class="comment-section">' +
      '<h3 style="margin-top: 2rem; margin-bottom: 1rem;">评论</h3>';

    // Render comment list
    if (comments && comments.length > 0) {
      html += '<div class="comment-list">';
      comments.forEach(function(comment) {
        const date = new Date(comment.timestamp).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        html += '<div class="comment-item">' +
          '<div class="comment-meta"><strong>' + comment.name + '</strong> ' +
          '<span style="color: var(--text-muted); font-size: 0.85rem;">' + date + '</span></div>' +
          '<p class="comment-content">' + comment.content + '</p>' +
        '</div>';
      });
      html += '</div>';
    } else {
      html += '<p style="color: var(--text-muted);">还没有评论，来发表第一条吧！</p>';
    }

    // Render comment form
    html += '<div class="comment-form">' +
      '<h4>发表评论</h4>' +
      '<input type="text" id="comment-name-' + postId + '" class="comment-input" placeholder="你的名字（可选）">' +
      '<textarea id="comment-content-' + postId + '" class="comment-textarea" placeholder="评论内容（最多 500 字）" maxlength="500"></textarea>' +
      '<button id="comment-submit-' + postId + '" class="comment-submit">发表评论</button>' +
      '<p id="comment-error-' + postId + '" class="error-msg" style="display: none;"></p>' +
      '<p id="comment-success-' + postId + '" style="color: #22c55e; display: none; margin: 0.5rem 0;">评论已发表！</p>' +
    '</div>' +
    '</div>';

    section.innerHTML = html;

    // Add event listener to submit button
    const submitBtn = document.getElementById('comment-submit-' + postId);
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        const name = document.getElementById('comment-name-' + postId).value;
        const content = document.getElementById('comment-content-' + postId).value;
        submitComment(postId, name, content);
      });
    }
  }

  function submitComment(postId, name, content) {
    const errorMsg = document.getElementById('comment-error-' + postId);
    const successMsg = document.getElementById('comment-success-' + postId);
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (!content || content.trim() === '') {
      errorMsg.textContent = '评论内容不能为空';
      errorMsg.style.display = 'block';
      return;
    }

    if (content.length > 500) {
      errorMsg.textContent = '评论内容过长（最多 500 字）';
      errorMsg.style.display = 'block';
      return;
    }

    fetch('/api/blog/posts/' + postId + '/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, content: content })
    })
    .then(function(res) {
      if (!res.ok) return res.json().then(function(err) { throw err; });
      return res.json();
    })
    .then(function(data) {
      successMsg.style.display = 'block';
      document.getElementById('comment-name-' + postId).value = '';
      document.getElementById('comment-content-' + postId).value = '';
      setTimeout(function() {
        successMsg.style.display = 'none';
        loadComments(postId);
      }, 1500);
    })
    .catch(function(err) {
      errorMsg.textContent = '评论发表失败，请重试';
      errorMsg.style.display = 'block';
      console.error('Error submitting comment:', err);
    });
  }

  function init() {
    setTheme(getTheme());

    document.querySelectorAll('[data-section]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (el.getAttribute('href') === '#') e.preventDefault();
        const id = el.getAttribute('data-section');

        // Handle blog section with authentication
        if (id === 'blog') {
          if (isBlogTokenValid()) {
            showSection('blog');
            loadBlogPosts();
          } else {
            showBlogAuthModal();
          }
          return;
        }

        if (id === 'home') {
          showSection('home');
          return;
        }
        if (id) showSection(id);
      });
    });

    // Blog authentication modal handlers
    const authSubmitBtn = document.getElementById('blog-auth-submit');
    const authCancelBtn = document.getElementById('blog-auth-cancel');
    const passwordInput = document.getElementById('blog-password-input');
    const backBtn = document.getElementById('blog-back-btn');

    if (authSubmitBtn) {
      authSubmitBtn.addEventListener('click', function() {
        const password = passwordInput.value.trim();
        if (password) {
          authenticateBlog(password);
        }
      });
    }

    if (authCancelBtn) {
      authCancelBtn.addEventListener('click', function() {
        hideBlogAuthModal();
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const password = this.value.trim();
          if (password) {
            authenticateBlog(password);
          }
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function() {
        document.getElementById('blog-post-list').style.display = 'block';
        document.getElementById('blog-post-detail').style.display = 'none';
      });
    }

    document.querySelector('.btn-theme')?.addEventListener('click', function () {
      toggleTheme();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
