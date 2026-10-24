(() => {
  const preview = document.querySelector('#post-preview');
  const count = document.querySelector('#post-count');
  const comment = document.querySelector('#comment');
  const charCount = document.querySelector('#char-count');
  const feedback = document.querySelector('#feedback');
  const groupOrder = ['party', 'self', 'recruit', 'vc'];
  const groupLabels = { party: '・パーティ：', self: '・自：', recruit: '・募：', vc: '・VC：' };
  let feedbackTimer;

  function selectedValues(group) {
    return [...document.querySelectorAll(`[data-group="${group}"] .choice[aria-pressed="true"]`)].map(button => button.dataset.value);
  }

  function generatePost() {
    const lines = ['#ユナイト募集'];
    for (const group of groupOrder) {
      const values = selectedValues(group);
      if (values.length) lines.push(`${groupLabels[group]}${values.join('、')}`);
    }
    const note = comment.value;
    if (note.trim()) lines.push(`・備考：${note}`);
    return lines.join('\n');
  }

  function render() {
    const post = generatePost();
    preview.textContent = post;
    count.textContent = [...post].length;
    charCount.textContent = `${comment.value.length} / 280`;
  }

  function showFeedback(message, isError = false) {
    clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.classList.toggle('error', isError);
    feedbackTimer = setTimeout(() => { feedback.textContent = ''; feedback.classList.remove('error'); }, 2800);
  }

  document.querySelectorAll('.option-list').forEach(list => {
    list.addEventListener('click', event => {
      const button = event.target.closest('.choice');
      if (!button) return;
      const wasSelected = button.getAttribute('aria-pressed') === 'true';
      if (list.dataset.group === 'vc') {
        list.querySelectorAll('.choice').forEach(item => item.setAttribute('aria-pressed', 'false'));
      }
      button.setAttribute('aria-pressed', String(!wasSelected));
      render();
    });
  });
  comment.addEventListener('input', render);

  document.querySelector('#copy-post').addEventListener('click', async () => {
    const post = generatePost();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(post);
      else {
        const helper = document.createElement('textarea');
        helper.value = post;
        helper.setAttribute('readonly', '');
        helper.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.append(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('copy unavailable');
      }
      showFeedback('投稿文をコピーしました');
    } catch {
      showFeedback('コピーできませんでした。プレビューから文章を選択してください。', true);
    }
  });

  document.querySelector('#post-x').addEventListener('click', () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatePost())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  document.querySelector('#reset-form').addEventListener('click', () => {
    document.querySelectorAll('.choice').forEach(button => button.setAttribute('aria-pressed', 'false'));
    comment.value = '';
    render();
    showFeedback('入力をリセットしました');
  });

  render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
