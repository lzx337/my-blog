/**
 * seo.js — 动态 SEO 模块：OG 标签 + JSON-LD 结构化数据
 * 依赖：utils.js（需先加载）
 * 加载位置：post.html（文章页）、index.html（首页）
 */
(function () {
  'use strict';

  function injectOGTag(property, content) {
    if (!content) return;
    var selector = 'meta[property="og:' + property + '"]';
    var existing = document.querySelector(selector);
    if (existing) { existing.setAttribute('content', content); return; }
    var meta = document.createElement('meta');
    meta.setAttribute('property', 'og:' + property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  function injectTwitterTag(name, content) {
    if (!content) return;
    var selector = 'meta[name="twitter:' + name + '"]';
    var existing = document.querySelector(selector);
    if (existing) { existing.setAttribute('content', content); return; }
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'twitter:' + name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  function injectJSONLD(structuredData) {
    var existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  function getPostDataFromDOM() {
    var h1 = document.querySelector('article h1') || document.querySelector('h1.ryuchan-heading');
    var title = h1 ? h1.textContent.trim() : document.title.replace(/\s*-\s*YQLCH$/, '').trim();

    var subtitleEl = document.querySelector('.banner .subtitle span') || document.querySelector('.banner .subtitle');
    var description = subtitleEl ? subtitleEl.textContent.trim() : '';

    var coverImg = document.querySelector('article img');
    var imageSrc = coverImg ? coverImg.getAttribute('src') || coverImg.getAttribute('data-src') || '' : '';
    var imageUrl = imageSrc ? (imageSrc.startsWith('http') ? imageSrc : window.location.origin + '/' + imageSrc.replace(/^\.\.\//, '')) : window.location.origin + '/assets/profile.png';

    var dateEl = document.querySelector('.banner .title');
    var publishedDate = '';
    var dateSpans = document.querySelectorAll('.post-meta-date, [class*="calendar"] + span, .flex.items-center.gap-1\\.5 span:nth-child(2)');
    if (dateSpans.length) {
      publishedDate = dateSpans[0].textContent.trim();
    }
    var dateRegex = /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/;
    var dateMatch = publishedDate.match(dateRegex);
    if (dateMatch) publishedDate = dateMatch[1].replace(/年|月/g, '-').replace(/日/g, '');

    var categoryEl = document.querySelector('.btn-category');
    var category = categoryEl ? categoryEl.textContent.trim() : '';

    var tagEls = document.querySelectorAll('.btn-tag');
    var tags = [];
    tagEls.forEach(function (el) { tags.push(el.textContent.trim()); });

    var authorName = 'YQLCH';
    var siteUrl = window.location.origin;
    var postUrl = window.location.href;

    return { title: title, description: description, imageUrl: imageUrl, publishedDate: publishedDate, category: category, tags: tags, authorName: authorName, siteUrl: siteUrl, postUrl: postUrl };
  }

  function injectSEO() {
    var data = getPostDataFromDOM();
    if (!data.title) return;

    injectOGTag('title', data.title);
    injectOGTag('description', data.description || data.title);
    injectOGTag('image', data.imageUrl);
    injectOGTag('url', data.postUrl);
    injectOGTag('type', 'article');
    injectOGTag('site_name', 'YQLCH\'s Blog');
    injectOGTag('locale', 'zh_CN');

    injectTwitterTag('card', 'summary_large_image');
    injectTwitterTag('title', data.title);
    injectTwitterTag('description', data.description || data.title);
    injectTwitterTag('image', data.imageUrl);

    var jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': data.title,
      'description': data.description || data.title,
      'image': data.imageUrl,
      'url': data.postUrl,
      'datePublished': data.publishedDate || new Date().toISOString().split('T')[0],
      'dateModified': data.publishedDate || new Date().toISOString().split('T')[0],
      'author': {
        '@type': 'Person',
        'name': data.authorName,
        'url': data.siteUrl
      },
      'publisher': {
        '@type': 'Person',
        'name': data.authorName,
        'url': data.siteUrl
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': data.postUrl
      },
      'wordCount': document.querySelector('article .prose') ? document.querySelector('article .prose').textContent.length : 0,
      'articleSection': data.category || undefined,
      'keywords': data.tags.length > 0 ? data.tags.join(', ') : undefined
    };

    injectJSONLD(jsonld);
  }

  var isPostPage = !!document.querySelector('article');
  if (isPostPage) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectSEO);
    } else {
      injectSEO();
    }
  }
})();