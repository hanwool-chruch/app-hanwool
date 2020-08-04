# Change file name and set branch manualy
BRANCH="master"

git fetch
git checkout "$BRANCH"
LOCAL=`git rev-parse "$BRANCH"`
REMOTE=`git rev-parse origin/"$BRANCH"`

if [ "$LOCAL" != "$REMOTE" ]; then
	git pull
	./build.sh
fi
