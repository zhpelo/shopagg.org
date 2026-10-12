// Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Scroll animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        const installContent = {
            git: {
                copyLabel: '复制',
                copyText: `git clone https://github.com/zhpelo/shopagg-b2b-website.git
cd shopagg-b2b-website
chmod -R 755 storage uploads`,
                html: `
                    <span class="comment"># 1. 克隆项目</span><br>
                    git clone https://github.com/zhpelo/shopagg-b2b-website.git<br><br>
                    <span class="comment"># 2. 设置运行目录权限</span><br>
                    chmod -R 755 storage uploads<br><br>
                    <span class="comment"># 3. 访问网站，自动初始化 SQLite 数据库</span>
                `
            },
            zip: {
                copyLabel: '复制链接',
                copyText: `https://github.com/zhpelo/shopagg-b2b-website/archive/refs/heads/main.zip`,
                html: `
                    <span class="comment"># 1. 下载最新版 ZIP 源码包</span><br>
                    <a href="https://github.com/zhpelo/shopagg-b2b-website/archive/refs/heads/main.zip" target="_blank">https://github.com/zhpelo/shopagg-b2b-website/archive/refs/heads/main.zip</a><br><br>
                    <span class="comment"># 2. 上传并解压到服务器网站目录</span><br>
                    unzip shopagg-b2b-website-main.zip<br><br>
                    <span class="comment"># 3. 设置 storage / uploads 可写，访问域名自动初始化</span>
                `
            },
            cloud: {
                copyLabel: '复制链接',
                copyText: `https://www.shopagg.com`,
                html: `
                    <div class="install-note">
                        <strong>不想做技术部署？</strong><br>
                        进入 SHOPAGG 云端部署平台，按页面提示填写站点信息，点点鼠标即可自动创建一个 B2B 网站，不需要配置服务器、上传代码或设置运行环境。
                    </div>
                    <a class="install-action" href="https://www.shopagg.com" target="_blank" rel="noopener">
                        <i class="fas fa-cloud-arrow-up"></i> 打开云端部署平台
                    </a>
                `
            }
        };

        let currentInstallTab = 'git';

        function renderInstallContent(tabKey) {
            const content = installContent[tabKey] || installContent.git;
            currentInstallTab = tabKey in installContent ? tabKey : 'git';
            const target = document.getElementById('installCodeContent');
            const copyButton = document.querySelector('.copy-btn');
            if (target) {
                target.innerHTML = content.html;
            }
            if (copyButton) {
                copyButton.innerHTML = `<i class="fas fa-copy"></i> ${content.copyLabel}`;
            }
        }

        renderInstallContent(currentInstallTab);

        function fallbackCopyText(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            let copied = false;
            try {
                copied = document.execCommand('copy');
            } catch (error) {
                copied = false;
            }
            document.body.removeChild(textarea);
            return copied;
        }

        function updateCopyButton(label, icon = 'fa-copy') {
            const btn = document.querySelector('.copy-btn');
            if (btn) {
                btn.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
            }
        }

        // Copy current install command or link
        function copyCode() {
            const content = installContent[currentInstallTab] || installContent.git;
            const code = content.copyText;
            const resetLabel = () => {
                updateCopyButton(content.copyLabel);
            };
            const markCopied = () => {
                updateCopyButton('已复制', 'fa-check');
                setTimeout(() => {
                    resetLabel();
                }, 2000);
            };
            const markFailed = () => {
                updateCopyButton('复制失败', 'fa-triangle-exclamation');
                setTimeout(() => {
                    resetLabel();
                }, 2000);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(code).then(markCopied).catch(() => {
                    fallbackCopyText(code) ? markCopied() : markFailed();
                });
                return;
            }

            fallbackCopyText(code) ? markCopied() : markFailed();
        }

        // Install tabs
        document.querySelectorAll('.install-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.install-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderInstallContent(this.dataset.installTab);
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        function toggleMobileMenu() {
            document.getElementById('mobilePanel').classList.toggle('open');
        }

        document.querySelectorAll('#mobilePanel a').forEach(link => {
            link.addEventListener('click', () => document.getElementById('mobilePanel').classList.remove('open'));
        });
