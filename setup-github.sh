#!/bin/bash

# GitHub repository setup script
# 실행 전에 GitHub에서 'tack-club' repository를 먼저 생성해주세요.

echo "GitHub Username을 입력하세요:"
read GITHUB_USERNAME

# Remote 추가
git remote add origin "https://github.com/$GITHUB_USERNAME/tack-club.git"

# 브랜치 이름을 v1.0.0으로 변경 (선택사항)
# git branch -m main v1.0.0

# main 브랜치로 푸시
git push -u origin main

# 태그 생성 (버전 관리용)
git tag -a v1.0.0 -m "Initial release - Tack Club v1.0.0"
git push origin v1.0.0

echo "✅ GitHub에 성공적으로 업로드되었습니다!"
echo "📍 Repository: https://github.com/$GITHUB_USERNAME/tack-club"
echo "🏷️  Tag: v1.0.0"