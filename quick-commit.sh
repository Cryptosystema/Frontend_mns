#!/bin/bash
# AUTO-COMMIT SCRIPT - Запускай через `./quick-commit.sh "commit message"`
# Обходит все проблемы VSCode и dev container

set -e
cd /workspaces/mns-terminal

if [ -z "$1" ]; then
  echo "❌ Ошибка: Укажи сообщение коммита"
  echo "Использование: ./quick-commit.sh \"твоё сообщение\""
  exit 1
fi

echo "🔄 Staging all changes..."
git add -A

echo "📝 Creating commit..."
git commit -m "$1"

echo "🚀 Pushing to origin/main..."
git push origin main

echo "✅ SUCCESS! Коммит создан и запушен!"
git log --oneline -1
